"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import {Dot} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
const LandingPage: React.FC = () => {
    const [question, setQuestion] = useState('');
    const router = useRouter();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const isAdmin = typeof window !== 'undefined' ? localStorage.getItem('isAdmin') : null

    if(token && isAdmin === 'false'){
        router.push('/userPost');
    }else if(token && isAdmin === 'true'){
        router.push('/admin');
    }

    return (
        <div className='min-h-screen flex flex-col'>
            <div className='container-fluid mt-5 '>
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
                                <Button className='border border-bluePrimary bg-white text-bluePrimary hover:bg-bluePrimary rounded-lg hover:text-white px-4 py-2 '>Register</Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <hr className='my-4 border-gray-300' />
                <div className="flex justify-center items-center my-20">
                    <div className='w-[80%] bg-grayBackground rounded-lg p-4'>
                        <div className='text-left'>
                            <h2 className='text-lg font-semibold'>Post Your Question</h2>
                            <textarea
                            style={{resize: "vertical", minHeight: "100px" }}
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className='w-full border border-gray-300 rounded-md px-3 py-2 mt-2'
                                placeholder='Type your question here...'></textarea>
                            <div className='flex justify-end mt-2'>
                                <Link href="/register">
                                    <Button className='border border-bluePrimary bg-white text-bluePrimary hover:bg-bluePrimary rounded-lg hover:text-white px-4 py-2'>Sign up to post your questions</Button>
                                </Link>
                            </div>
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
                    <span><Dot/></span>
                    <span><a href="/privacyPolicy" className='text-bluePrimary underline decoration-white underline-offset-4'>Privacy Policy</a></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;