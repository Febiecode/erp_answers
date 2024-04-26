"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
const LandingPage: React.FC = () => {
    const [question, setQuestion] = useState('');

    return (
        <div className='min-h-screen flex flex-col'>
            <div className='container-fluid mt-5 '>
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
                                    <Button className='text-bluePrimary bg-white hover:bg-bluePrimary hover:text-white border-2 border-bluePrimary font-semibold py-2 px-4 rounded-md mx-2'>Sign up to post your questions</Button>
                                </Link>
                            </div>
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
};

export default LandingPage;