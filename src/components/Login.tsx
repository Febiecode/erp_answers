"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { Dot } from "lucide-react"
import { useRouter } from 'next/navigation';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import Spinner from '../components/Spinner';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useFormStatus } from 'react-dom';

import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"

import api from '../services/api'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Please enter a email" })
        .email({ message: "Invalid Email Format" }),
    password: z.string().min(1, {
        message: "Please Enter The Password",
    }).min(5, {
        message: "Password must be at least 6 characters."
    }),
})

const Login = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [err, setErr] = useState('')
    const router = useRouter();
    const { pending } = useFormStatus();

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const isAdmin = typeof window !== 'undefined' ? localStorage.getItem('isAdmin') : null

    if (token && isAdmin === 'false') {
        router.push('/userPost');
    } else if (token && isAdmin === 'true') {
        router.push('/admin');
    }
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })



    useEffect(() => {
        // Set timeout to hide success alert after 3 seconds
        if (err) {
            // form.reset()
            const successTimer = setTimeout(() => {
                setErr('');
            }, 3000);

            return () => clearTimeout(successTimer);
        }

    }, [err]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {

            const response = await api.post('api/Login/Login', values);
            // Assuming the response contains session information like a token
            const { userName, email, userId, token, isAdmin } = response.data;
            const userExist = await api.get('api/Register/Email?Email=' + email);
            console.log(userExist.status)

            if (userExist.status === 204 || userExist.status === 203) {

                setErr('Please give a valid user credentials.');
                setIsSubmitting(false);
            } else if (isAdmin === false && userExist.status === 200) {
                // Store the token in local storage
                localStorage.setItem('token', token);
                localStorage.setItem('userName', userName);
                localStorage.setItem('email', email);
                localStorage.setItem('userId', userId);
                localStorage.setItem('isAdmin', isAdmin);
                router.push('userPost');
            } else if (isAdmin === true && userExist.status === 200) {
                localStorage.setItem('token', token);
                localStorage.setItem('userName', userName);
                localStorage.setItem('email', email);
                localStorage.setItem('userId', userId);
                localStorage.setItem('isAdmin', isAdmin);
                router.push('admin');
            }

        } catch (error) {
            console.error('Login failed:', error);
            // Handle login failure, maybe display an error message to the user
        }
    }
    return (
        <div className='min-h-screen flex flex-col'>
            <div className='container-fluid  mt-5'>
                <div className='flex justify-between'>
                    <div className=' w-full flex justify-between'>
                        <Link href="/">
                            <h1 className='text-xl font-bold items-center mx-5'><span className='text-redCustom'>ERP</span><span className='text-bluePrimary'>Answers</span></h1>
                        </Link>
                        <div className='flex items-center mx-5 gap-3'>
                            <Link href="/login">
                                <Button className='bg-bluePrimary hover:bg-bluePrimary text-white font-semibold border-1 py-2 px-4 rounded-md'>Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button className='border border-bluePrimary bg-white text-bluePrimary hover:bg-bluePrimary rounded-lg hover:text-white px-4 py-2'>Register</Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <hr className='my-4 border-gray-300' />

                <div className="w-full flex flex-col items-center mt-20 mb-10">
                    <div className=' xl:w-[30%] lg:w-[40%] sm:w-[95%] xxsm:w-[95%] flex flex-col justify-center bg-blueSecondary p-5 rounded-lg'>
                        <div className='flex flex-col items-center mb-5'>
                            <Link href="/">
                                <h1 className='text-xl font-bold items-center mx-5 my-2'><span className='text-redCustom'>ERP</span><span className='text-bluePrimary'>Answers</span></h1>
                            </Link>
                            <h1 className='font-semibold text-xl my-2 text-center'>Get Started With ERPAnswers</h1>
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input className='bg-white p-5' placeholder="email@example.com" {...field} />
                                            </FormControl>
                                            {/* <FormDescription>
                                This is your public display name.
                            </FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormControl>
                                                <Input className='bg-white p-5' placeholder="Password" type='password' {...field} showPasswordToggle />
                                            </FormControl>
                                            {/* <FormDescription>
                                This is your public display name.
                            </FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-center">
                                    <Button className='bg-bluePrimary hover:bg-bluePrimary text-white font-semibold py-2 px-4 rounded-md w-full' type="submit" disabled={pending}>{isSubmitting ? <Spinner /> : "Login"}</Button>
                                </div>
                            </form>
                            <div className='mt-5'>
                                {err && (
                                    <Alert variant="destructive">
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{err}</AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </Form>
                        <div className='pt-5 flex w-full justify-center'>
                            <a href="/register">Not a User? <span className='text-bluePrimary '>Sign Up</span></a>
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
        </div>
    );
}

export default Login