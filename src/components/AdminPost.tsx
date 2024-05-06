"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { withAuth } from '../utils/adminAuth';
import api from '../services/api'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from 'next/navigation';

import { Textarea } from "@/components/ui/textarea"

import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

interface unAnsweredQuestions {
    id: number;
    userID: number;
    email: string;
    question1: string;
    answer: string;
    module: string;
    subModule: string;
}


interface AnsweredQuestions {
    id: number;
    userID: number;
    email: string;
    question1: string;
    answered: true;
    answer1: string;
    module: string;
    subModule: string;
}

const formSchema = z.object({
    answer: z.string(),
})

const AdminPost = () => {
    const [unAnsweropenIndex, setunAnsweropenIndex] = useState<number | null>(null);
    const [answeropenIndex, setansweropenIndex] = useState<number | null>(null);
    const [unAnsweredQuestions, setunAnsweredQuestions] = useState<unAnsweredQuestions[]>([]);
    const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestions[]>([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [answers, setAnswers] = useState(Array(unAnsweredQuestions.length).fill(''));
    const [index, setIndex] = useState(0);
    const router = useRouter();
    const { toast } = useToast()

    const handleTextareaChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        setIndex(index)
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const isAdmin = typeof window !== 'undefined' ? localStorage.getItem('isAdmin') : null

    if (token && isAdmin === 'true') {
        router.push('/admin');
    }

    useEffect(() => {
        // Set timeout to hide success alert after 3 seconds
        if (isSuccess) {
            const successTimer = setTimeout(() => {
                setIsSuccess(false);
                window.location.reload()
            }, 1500); // 3 seconds
            return () => clearTimeout(successTimer);
        }

        // Set timeout to hide error alert after 3 seconds
        if (isError) {
            const errorTimer = setTimeout(() => {
                setIsError(false);
            }, 3000); // 3 seconds
            return () => clearTimeout(errorTimer);
        }
    }, [isSuccess, isError]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const UnAnsweredQuestionResponse = await api.get('api/ERP/UnAnsweredQuestion');
                setunAnsweredQuestions(UnAnsweredQuestionResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const answeredQuestionsResponse = await api.get('api/ERP/AnsweredQuestions');
                setAnsweredQuestions(answeredQuestionsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            answer: '',
        },
    })




    async function onSubmit(values: z.infer<typeof formSchema>, additionalData: unAnsweredQuestions) {
        try {

            if (answers[index] !== '') {
                const formData = {
                    userID: additionalData.userID, answer: answers[index], questionID: additionalData.id
                }

                console.log(formData)
                // Make a POST request to the API endpoint with the form values
                const response = await api.post("api/ERP/Answer", formData);
                // Handle success response
                console.log("Form submitted successfully:", response.data);
                form.reset();
                setIsSuccess(true);
            } else {
                console.log("Form is Empty.");
                setIsError(true);
            }
            // Optionally, you can show a success message or redirect the user
        } catch (error) {
            // Handle error response
            console.error("Error submitting form:", error);
            setIsError(true);
            // Optionally, you can show an error message to the user
        }
    }


    return (
        <>
            <div className='min-h-screen flex flex-col'>
                <div className='container-fluid mt-5 '>
                    <div className='flex justify-between'>
                        <div className=' w-full flex justify-between'>
                            <h1 className='text-xl font-bold items-center mx-5'><span className='text-redCustom'>ERP</span><span className='text-bluePrimary'>Answers</span></h1>
                            <div className='flex items-center mx-8'>


                                <AlertDialog>
                                    <AlertDialogTrigger className='bg-bluePrimary text-white hover:bg-bluePrimary rounded-lg py-2 px-4 '>Logout</AlertDialogTrigger>
                                    <AlertDialogContent className='lg:w-[40%] sm:w-[80%]'>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <Link href='logout'>
                                                <AlertDialogAction className='bg-bluePrimary hover:bg-bluePrimary me-3'>Ok</AlertDialogAction>
                                            </Link>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </div>
                    <hr className='my-4 border-gray-300' />

                </div>


                <div className="container-fluid h-full mb-10">



                    <div className="lg:flex h-full">
                        <div className="lg:w-1/2 h-full">
                            <div className='bg-grayBackground border border-1 border-bluePrimary rounded-lg p-4 mt-10 mx-5 h-full'>
                                <h3 className='text-lg font-semibold mb-2'>Unanswered Questions</h3>
                                
                                    
                                        
                                    
                            


                                {unAnsweredQuestions.map((unAnsweredQuestion, index) => (
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value={`item-${index}`}>
                                            <AccordionTrigger><div className='flex flex-col  w-full'>
                                                <div className='flex justify-between'>
                                                    <div className='font-semibold'>{unAnsweredQuestion.question1}</div>
                                                    <div className='flex'>
                                                        <span className="text-xs bg-gray-400 rounded-xl px-1 ms-1 flex items-center">{unAnsweredQuestion.module}</span>
                                                        <span className="text-xs  bg-gray-500 rounded-xl px-1 ms-1 flex items-center">{unAnsweredQuestion.subModule}</span>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-500 text-left">{unAnsweredQuestion.email}</div>

                                            </div></AccordionTrigger>
                                            <AccordionContent>

                                                <div className="p-2">
                                                    <Form {...form}>
                                                        <form onSubmit={form.handleSubmit(data => onSubmit(data, unAnsweredQuestion))} className="space-y-4">
                                                            <FormField
                                                                control={form.control}
                                                                name="answer"
                                                                render={() => (
                                                                    <FormItem>
                                                                        <FormLabel>Post Your Answer</FormLabel>
                                                                        <FormControl>

                                                                            <Textarea
                                                                                placeholder='Type your answer here...'
                                                                                value={answers[index]}
                                                                                onChange={(e) => handleTextareaChange(index, e.target.value)}
                                                                            />

                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <div className="flex">
                                                                <Button type="submit" className='bg-bluePrimary hover:bg-bluePrimary text-white font-semibold py-2 px-4 rounded-md'>Add</Button>
                                                            </div>
                                                        </form>
                                                    </Form>
                                                </div>

                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ))}
                                {isSuccess && (
                                            <Alert variant="success" className='fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg'>
                                                <AlertTitle>Success</AlertTitle>
                                                <AlertDescription>Form submitted successfully</AlertDescription>
                                            </Alert>
                                        )}
                                        {isError && (
                                            <Alert variant="destructive" className='fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg'>
                                                <AlertTitle>Error</AlertTitle>
                                                <AlertDescription>Please Enter Your Answer</AlertDescription>
                                            </Alert>
                                        )}
                            </div>
                        </div>
                        <div className="lg:w-1/2 h-full">
                            <div className='bg-grayBackground border border-1 border-bluePrimary rounded-lg p-4 mt-10 mx-5 h-full overflow-y-auto'>
                                <h3 className='text-lg font-semibold mb-2'>Answered Questions</h3>



                                {answeredQuestions.map((answeredQuestion, index) => (
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value={`item-${index}`}>
                                            <AccordionTrigger>
                                                <div className='flex flex-col  w-full'>
                                                    <div className='flex justify-between'>
                                                        <div className='font-semibold'>{answeredQuestion.question1}</div>
                                                        <div className='flex'>
                                                            <span className=" bg-gray-400 rounded-xl text-xs px-1 me-1 flex text-center items-center">{answeredQuestion.module}</span>
                                                            <span className=" bg-gray-500 rounded-xl text-xs px-1 flex text-center items-center">{answeredQuestion.subModule}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-500">{answeredQuestion.email}</div>

                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                {answeredQuestion.answer1}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>


                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto border-t border-gray-300 bg-[#29363E] py-4 text-white">
                    <div className="container mx-auto">
                        {/* <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="lg:col-span-1 sm:col-span-12">
                            <h1 className="font-semibold">RapidSoft Solutions @ 2024. All rights reserved</h1>
                        </div>
                        <div className="lg:col-span-1 sm:col-span-12 lg:text-end xxsm:mt-5 lg:mt-0">
                            <span className="pr-2">Terms</span>
                            <span className="pr-2">Privacy</span>
                        </div>
                    </div> */}

                        <div className='flex justify-center items-center text-xs'>
                            <span className='font-extralight'>© CopyRight 2024&ensp;</span>
                            <span>RapidSoft Solutions.&ensp;</span>
                            <span className='font-extralight'>All Rights Reserved</span>
                            <span><Dot /></span>
                            <span><a href="/privacyPolicy" className='text-bluePrimary underline decoration-white underline-offset-4'>Privacy Policy</a></span>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default withAuth(AdminPost)