"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link';
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

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import api from '../services/api'

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter the Email ",
    }),
    username: z.string().min(4, {
        message: "Please enter the Username",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Those passwords didn't match",
    path: ["confirmPassword"],
});

const Register = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [err, setErr] = useState('')
    const { pending } = useFormStatus();

    const router = useRouter();
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
            confirmPassword: ""
        },
    })
    useEffect(() => {
        form.reset()
        if (err) {
            const successTimer = setTimeout(() => {
            }, 3000);
            return () => clearTimeout(successTimer);
        }

    }, [err]);


    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {

            const formData = { email: values.email, password: values.password, confirmPassword: values.confirmPassword, isAdmin: false, userName: values.username, isActive: true }
            console.log(formData)
            const userExist = await api.get('api/Register/Email?Email=' + values.email);
            if (userExist.status === 203 || userExist.status === 204) {
                const response = await api.post('api/Register/register', formData);
                const { token } = response.data;
                // Store the token in local storage
                localStorage.setItem('token', token);
                router.push('/login');
            } else if (userExist.status === 200) {
                router.push('/register');
                setIsSubmitting(false);
                setErr('User is already exist.')
            }
        } catch (error) {
            console.error('Registration failed', error);
            setErr('Registration failed')
            setIsSubmitting(false);
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
                        <div className='flex items-center mx-5  gap-3'>
                            <Link href="/login">
                                <Button className='border border-bluePrimary bg-white text-bluePrimary hover:bg-bluePrimary rounded-lg hover:text-white px-4 py-2 '>Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button className='bg-bluePrimary hover:bg-bluePrimary text-white font-semibold border-1 py-2 px-4 rounded-md'>Register</Button>
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
                            <form id='myForm' onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input className='bg-white p-5' placeholder="Email Format" {...field} />
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
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input className='bg-white p-5' placeholder="Username" {...field} />
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
                                                <Input className='bg-white p-5' placeholder="Password" {...field} type='password' showPasswordToggle />
                                                {/* Icon to toggle password visibility */}

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
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormControl>
                                                <Input className='bg-white p-5' placeholder="Confirm Password" type='password' {...field} showPasswordToggle />
                                            </FormControl>
                                            {/* <FormDescription>
                                This is your public display name.
                            </FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-center">
                                    <Button className='bg-bluePrimary hover:bg-bluePrimary text-white font-semibold py-2 px-4 rounded-md w-full' type="submit" disabled={pending}>{isSubmitting ? <Spinner /> : "Register"}</Button>
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
                            <a href="/login">Aleardy a User? <span className='text-bluePrimary '>Sign In</span></a>
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
    );
}

export default Register