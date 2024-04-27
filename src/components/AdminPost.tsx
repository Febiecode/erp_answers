"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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

interface unAnsweredQuestions {
    id: number;
    userID: number;
    email: string;
    question1: string;
    answer: string;
}


interface AnsweredQuestions {
    id: number;
    userID: number;
    email: string;
    question1: string;
    answered: true;
    answer1: string;
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
    const router = useRouter();

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const isAdmin = typeof window !== 'undefined' ? localStorage.getItem('isAdmin') : null

    if(token && isAdmin === 'true'){
        router.push('/admin');
    }

    useEffect(() => {
        // Set timeout to hide success alert after 3 seconds
        if (isSuccess) {
            const successTimer = setTimeout(() => {
                setIsSuccess(false);
            }, 3000); // 3 seconds
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

            if (values.answer !== '') {
                const formData = {
                    userID: additionalData.userID, answer: values.answer, questionID: additionalData.id
                }
                // Make a POST request to the API endpoint with the form values
                const response = await api.post("api/ERP/Answer", formData);


                // // Handle success response
                console.log("Form submitted successfully:", response.data);
                setIsSuccess(true);
            }else{
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


    const toggleQuestion1 = (index: number) => {
        if (unAnsweropenIndex === index) {
            setunAnsweropenIndex(null);
        } else {
            setunAnsweropenIndex(index);
        }
    };

    const toggleQuestion2 = (index: number) => {
        if (answeropenIndex === index) {
            setansweropenIndex(null);
        } else {
            setansweropenIndex(index);
        }
    };
    return (
        <>
            <div className='min-h-screen flex flex-col'>
                <div className='container-fluid mt-5 '>
                    <div className='flex justify-between'>
                        <div className=' w-full flex justify-between'>
                            <h1 className='text-xl font-bold items-center mx-5'><span className='text-redCustom'>ERP</span><span className='text-bluePrimary'>Answers</span></h1>
                            <div className='flex items-center mx-8'>
                                <Link href='logout'>
                                    <Button className='bg-bluePrimary hover:bg-bluePrimary text-white font-semibold py-2 px-4 rounded-md' >
                                        Logout
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <hr className='my-4 border-gray-300' />

                </div>


                <div className="container-fluid h-full mb-10">
                    <div className="lg:flex h-full">
                        <div className="lg:w-1/2 h-full">
                            <div className='bg-grayBackground border border-1 border-bluePrimary rounded-lg p-4 mt-10 mx-5 h-full overflow-y-auto'>
                                <h3 className='text-lg font-semibold mb-2'>Unanswered Questions</h3>
                                {unAnsweredQuestions.map((unAnsweredQuestion, index) => (
                                    <div key={index} className='rounded-md border border-gray-300 my-2 bg-white'>
                                        <div className="flex justify-between items-center p-2 cursor-pointer border border-1 border-gray-200 " onClick={() => toggleQuestion1(index)}>
                                            <div className='flex flex-col'>
                                                <div>{unAnsweredQuestion.question1}</div>
                                                <div className="text-sm text-gray-500">{unAnsweredQuestion.email}</div>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform transform ${unAnsweropenIndex === index ? 'rotate-180' : 'rotate-0'}`} viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 5.293a1 1 0 011.414 0L10 9.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414zM10 18a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        {unAnsweropenIndex === index && (
                                            <div className="p-2">
                                                <Form {...form}>
                                                    <form onSubmit={form.handleSubmit(data => onSubmit(data, unAnsweredQuestion))} className="space-y-4">
                                                        <FormField
                                                            control={form.control}
                                                            name="answer"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Post Your Question</FormLabel>
                                                                    <FormControl>

                                                                        <Textarea {...field}
                                                                            placeholder='Type your question here...' />

                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <div className="flex text-left">
                                                            {isSuccess && (
                                                                <Alert variant="success">
                                                                    <AlertTitle>Success</AlertTitle>
                                                                    <AlertDescription>Form submitted successfully</AlertDescription>
                                                                </Alert>
                                                            )}
                                                            {isError && (
                                                                <Alert variant="destructive">
                                                                    <AlertTitle>Error</AlertTitle>
                                                                    <AlertDescription>Failed to submit form. Please try again later.</AlertDescription>
                                                                </Alert>
                                                            )}
                                                        </div>
                                                        <div className="flex">
                                                            <Button type="submit" className='bg-bluePrimary hover:bg-bluePrimary text-white font-semibold py-2 px-4 rounded-md'>Add</Button>
                                                        </div>
                                                    </form>
                                                </Form>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 h-full">
                            <div className='bg-grayBackground border border-1 border-bluePrimary rounded-lg p-4 mt-10 mx-5 h-full overflow-y-auto'>
                                <h3 className='text-lg font-semibold mb-2'>Answered Questions</h3>
                                
                                {answeredQuestions.map((answeredQuestion, index) => (
                                    <div key={index} className='rounded-md border border-gray-300 my-2 bg-white'>
                                        <div className="flex justify-between items-center p-2 cursor-pointer border border-1 border-gray-200 " onClick={() => toggleQuestion2(index)}>
                                            
                                            <div className='flex flex-col '>
                                                <div>{answeredQuestion.question1}</div>
                                                <div className="text-sm text-gray-500">{answeredQuestion.email}</div>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform transform ${answeropenIndex === index ? 'rotate-180' : 'rotate-0'}`} viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 5.293a1 1 0 011.414 0L10 9.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414zM10 18a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        {answeropenIndex === index && (
                                            <div className="p-2">
                                                {answeredQuestion.answer1}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="mt-auto border-t border-gray-300 bg-[#29363E] py-4 text-white">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="lg:col-span-1 sm:col-span-12">
                                <h1 className="font-semibold">RapidSoft Solutions @ 2024. All rights reserved</h1>
                            </div>
                            <div className="lg:col-span-1 sm:col-span-12 lg:text-end xxsm:mt-5 lg:mt-0">
                                <span className="pr-2">Terms</span>
                                <span className="pr-2">Privacy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default withAuth(AdminPost)