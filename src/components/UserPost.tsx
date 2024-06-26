"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dot } from "lucide-react"
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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from 'next/navigation';


import { Textarea } from "@/components/ui/textarea"

import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"

import { Button } from "@/components/ui/button"
import { withAuth } from '../utils/auth';
import api from '../services/api'
interface Response {
    id: number;
    userID: number;
    email: string;
    module: string;
    subModule: string;
    question1: string;
    answer: string;
    answered: boolean;
}

interface Domains {
    id: number;
    domainName: string;
}


interface subDomains {
    id: number;
    domainID: number;
    code: string;
    description: string;
}

const formSchema = z.object({
    ques: z.string().min(1, { message: "Please enter a question" }),
    module: z.string().min(1, { message: "Please enter a module" }),
    subModule: z.string().min(1, { message: "Please enter a sub module" }),
})

const UserPost = () => {
    const [isClient, setIsClient] = useState(false)
    const [responses, setResponses] = useState<Response[]>([]);
    const [domains, setDomains] = useState<Domains[]>([]);
    const [domainid, setDomainid] = useState(0)
    const [subDomains, setSubDomains] = useState<subDomains[]>([]);
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [err, setErr] = useState('');
    const router = useRouter();

    const email = typeof window !== 'undefined' ? localStorage.getItem('email') : null
    const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') : null
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const isAdmin = typeof window !== 'undefined' ? localStorage.getItem('isAdmin') : null

    if (token && isAdmin === 'false') {
        router.push('/userPost');
    }

    useEffect(() => {
        // Set timeout to hide success alert after 3 seconds
        if (isSuccess) {
            const successTimer = setTimeout(() => {
                setIsSuccess(false);
                window.location.reload();
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

        if (err) {
            const errorTimer = setTimeout(() => {
                setErr('');
            }, 3000); // 3 seconds
            return () => clearTimeout(errorTimer);
        }
    }, [isSuccess, isError, err]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('api/ERP/QuestionAnswerByUserID?userId=' + userId);
                setResponses(response.data);
                setIsClient(true)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userId]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('api/ERP/Domain');
                setDomains(response.data);
                setIsClient(true)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('api/ERP/DomainValue?domainID=' + domainid);
                console.log(response.data)
                setSubDomains(response.data);
                setIsClient(true)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [domainid]);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ques: '',
            module: '',
            subModule: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {

            if (values.ques !== "" && values.module !== "" && values.subModule !== "") {
                const formData = { "userID": userId, "email": email, question: values.ques, module: values.module, subModule: values.subModule }

                console.log(formData)
                // Make a POST request to the API endpoint with the form values
                const response = await api.post("api/ERP/Question", formData);
                // Handle success response
                console.log("Form submitted successfully:", response.data);
                form.reset();

                setIsSuccess(true);
            }
            else {
                console.log("Error submitting form");
                setIsError(true);
            }
            // Optionally, you can show a success message or redirect the user
        } catch (error) {
            // Handle error response
            console.error("Error submitting form:", error);
            form.reset();
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

                                <AlertDialog >
                                    <AlertDialogTrigger className='bg-bluePrimary text-white hover:bg-bluePrimary rounded-lg py-2 px-4 '>Logout</AlertDialogTrigger>
                                    <AlertDialogContent className='lg:w-[40%] sm:w-[80%]'>
                                        <AlertDialogHeader >
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
                    <div className="flex justify-center">
                        <div className='w-[90%] bg-grayBackground rounded-lg p-4'>
                            <div className='text-left'>
                                <div className='flex items-center mb-5'>
                                    <CircleUserRound />
                                    <h1 className='text-lg font-semibold ms-1'>{isClient ? userName : 'Please Login'}</h1>
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
                                        <FormField
                                            control={form.control}
                                            name="module"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-lg font-semibold mb-2'>Select Module</FormLabel>
                                                    <Select onValueChange={(value) => {
                                                        // Handle module selection change
                                                        field.onChange(value);
                                                        const selectedModule = domains.find(domain => domain.domainName === value);

                                                        setDomainid(selectedModule!.id)
                                                    }}
                                                        defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a module" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {domains.map((domain, index) => (
                                                                <div key={index}>
                                                                    <SelectItem key={index} value={`${domain.domainName}`}>{domain.domainName}</SelectItem>
                                                                </div>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {domainid !== 0 &&
                                            <FormField
                                                control={form.control}
                                                name="subModule"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className='text-lg font-semibold mb-2'>Select Module</FormLabel>
                                                        <Select onValueChange={field.onChange}
                                                            defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a sub module" className='text-muted' />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {subDomains.map((subDomain, index) => (
                                                                    <div key={index}>
                                                                        <SelectItem key={index} value={`${subDomain.description}`}>{subDomain.description}</SelectItem>
                                                                    </div>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />


                                        }


                                        <div className="flex text-left">
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
                                        <div className="flex">
                                            <Button type="submit" className='bg-bluePrimary hover:bg-bluePrimary text-white font-semibold py-2 px-4 rounded-md'>Add</Button>
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        </div>
                    </div>

                </div>


                <div className='flex justify-center mb-5'>
                    <div className='w-[90%] bg-grayBackground border border-1 border-bluePrimary rounded-lg p-4 mt-10 mx-5 h-full '>
                        <h3 className='text-lg font-semibold mb-2'>Previously Asked Questions</h3>


                        {responses.map((response, index) => (
                            <Accordion key={index} type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>
                                        <div className='w-full'>
                                            <div className=' flex flex-row gap-3 justify-between'>

                                                <div>
                                                    <p className='font-semibold text-left text-md'>{response.question1}</p>
                                                    <div className='flex'>
                                                        <span className=" bg-gray-400 rounded-xl text-xs px-1 flex text-center items-center me-3">{response.module}</span>
                                                        <span className=" bg-gray-500 rounded-xl text-xs px-1 flex text-center items-center">{response.subModule}</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    {response.answered &&
                                                        <span className='bg-green-500 rounded-xl text-xs px-1 flex text-center items-center'>Answered</span>
                                                    }

                                                    {response.answered === false &&
                                                        <span className='bg-red-500 rounded-xl text-xs px-1 flex text-center items-center'>Not Answered</span>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {response.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ))}
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
            </div>
        </>
    )
}

export default withAuth(UserPost)