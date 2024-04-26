"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CircleUserRound } from 'lucide-react';

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



import { Textarea } from "@/components/ui/textarea"

import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"

import { Button } from "@/components/ui/button"
import { withAuth } from '../utils/auth';
import api from '../services/api'
interface Response {
    id: number;
    userID: number;
    email: string;
    question1: string;
    answer: string;
}

const formSchema = z.object({
    ques: z.string()
})

const UserPost = () => {
    const [responses, setResponses] = useState<Response[]>([]);
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const email = typeof window !== 'undefined' ? localStorage.getItem('email') : null
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null

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
                const response = await api.get('api/ERP/QuestionAnswerByUserID?userId=' + userId);
                setResponses(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ques: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {

            if (values.ques !== "") {
                const formData = { "userID": userId, "email": email, question: values.ques }
                // Make a POST request to the API endpoint with the form values
                const response = await api.post("api/ERP/Question", formData);

                // Handle success response
                console.log("Form submitted successfully:", response.data);
                setIsSuccess(true);
            } else {
                console.log("Error submitting form");
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


    const toggleQuestion = (index: number) => {
        if (openIndex === index) {
            setOpenIndex(null);
        } else {
            setOpenIndex(index);
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
                                {/* <ProfileWithStatus online={true} imageUrl={profileImg}/> 
                                <NameRoleComponent name="John" role=""/> */}

                                <Link href='logout'>
                                    <Button
                                        className='bg-bluePrimary hover:bg-bluePrimary text-white font-semibold py-2 px-4 rounded-md'
                                    >
                                        Logout
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <hr className='my-4 border-gray-300' />
                    <div className="flex justify-center">
                        <div className='w-[90%] bg-grayBackground rounded-lg p-4'>
                            <div className='text-left'>
                                <div className='flex'>
                                    <CircleUserRound /><h1 className='text-lg font-semibold mb-10'>{email}</h1>
                                </div>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="ques"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-lg font-semibold mb-2'>Post Your Question</FormLabel>
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
                        </div>
                    </div>

                </div>


                <div className='flex justify-center mb-5'>
                    <div className='w-[90%] bg-grayBackground border border-1 border-bluePrimary rounded-lg p-4 mt-10 mx-5 h-full overflow-y-auto'>
                        <h3 className='text-lg font-semibold mb-2'>Previously Asked Questions</h3>
                        
                        {responses.map((response, index) => (
                            <div key={index} className='rounded-md border border-gray-300 my-2 bg-white'>
                                <div className="flex justify-between items-center p-2 cursor-pointer border border-1 border-gray-200 " onClick={() => toggleQuestion(index)}>
                                    <div className='flex flex-col'>
                                        <div>{response.question1}</div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform transform ${openIndex === index ? 'rotate-180' : 'rotate-0'}`} viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 5.293a1 1 0 011.414 0L10 9.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414zM10 18a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                {openIndex === index && (
                                    <div className="p-2">
                                        {response.answer}
                                    </div>
                                )}
                            </div>
                        ))}
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

export default withAuth(UserPost)