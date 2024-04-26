"use client"

import React, {useState} from 'react'
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

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import api from '../services/api'

const formSchema = z.object({
    email: z.string().email({
        message: "Invalid email format.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

const Register = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {

            const formData = {email: values.email, password: values.password, confirmPassword: values.confirmPassword, isAdmin: false, userName: values.email.slice(0, values.email.indexOf("@")), isActive: true}
            
            const response = await api.post('api/Register/register', formData);
            // Assuming the response contains session information like a token
            const { token} = response.data;
            // Store the token in local storage
            localStorage.setItem('token', token);

            if(!token){
                router.push('/login');
            }else{
                router.push('/register');
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
                        <div className='flex items-center mx-5'>
                            <Link href="/login">
                                <Button className='text-black bg-white hover:bg-bluePrimary hover:text-white border-none font-semibold py-2 px-4 rounded-md mx-2'>Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button className='text-bluePrimary bg-white hover:bg-bluePrimary hover:text-white border-2 border-bluePrimary font-semibold py-2 px-4 rounded-md mx-2'>Register</Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <hr className='my-4 border-gray-300' />
                <div className="w-full flex flex-col items-center mt-20 mb-10">
                    <div className=' xl:w-[30%] lg:w-[40%] sm:w-[95%] xxsm:w-[95%] flex flex-col justify-center bg-blueSecondary p-5 rounded-lg'>
                        <div className='flex flex-col items-center'>
                            {/* <Image src={require('../../../public/vercel.svg')} alt='naiduhall logo' width={100} height={100} className='my-5'/> */}

                            <h1 className='text-[30px] font-semibold my-2'>Product Logo</h1>

                            <h1 className='font-semibold text-xl my-2 text-center'>Get Starter with ERP Answers</h1>
                            <h1 className='text-gray-400 mb-5 text-sm text-center'>Enter your personal infomation</h1>
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input className='bg-white p-5' placeholder="Enter Email" {...field} />
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
                                                <Input className='bg-white p-5' placeholder="Password" type='password' {...field} />
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
                                                <Input className='bg-white p-5' placeholder="Confirm Password" type='password' {...field} />
                                            </FormControl>
                                            {/* <FormDescription>
                                This is your public display name.
                            </FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-center">
                                    <Button className='bg-bluePrimary hover:bg-bluePrimary text-white font-semibold py-2 px-4 rounded-md w-full' type="submit">{isSubmitting ? <Spinner /> : "Register"}</Button>
                                </div>
                            </form>
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