"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import ProfileWithStatus from './ProfileWithStatus';
import NameRoleComponent from './NameRoleComponent';

const postResponse = () => {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [previousQuestions, setPreviousQuestions] = useState<string[]>(["What is Vue", "Is js single-threaded or multi-threaded", "Event Loop?"]);

    const profileImg = require("../../public/profile.svg")


    const handleSubmit = async () => {
        if (question.trim() === '') {
            // If empty, return without submitting
            return;
        }
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');

            if (!response.ok) {
                throw new Error('Failed to fetch response');
            }

            const responseData = await response.json();
            // Simulate a response based on the user's question
            setResponse(responseData.title);

            // setPreviousQuestions(prevQuestions => [...prevQuestions, question]);

            setQuestion('');
        } catch (error) {
            console.error('Error:', error);
            setResponse('Sorry, something went wrong. Please try again later.');
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
                                {/* <Link href="/login">
                                    <Button className='text-black bg-white hover:bg-bluePrimary hover:text-white border-none font-semibold py-2 px-4 rounded-md mx-2'>Login</Button>
                                </Link>
                                <Link href="/register">
                                    <Button className='text-bluePrimary bg-white hover:bg-bluePrimary hover:text-white border-2 border-bluePrimary font-semibold py-2 px-4 rounded-md mx-2'>Register</Button>
                                </Link> */}
                                <ProfileWithStatus online={true} imageUrl={profileImg}/> 
                                <NameRoleComponent name="John" role=""/>
                            </div>
                        </div>
                    </div>
                    <hr className='my-4 border-gray-300' />
                    <div className="flex justify-center">
                        <div className='w-[90%] bg-grayBackground rounded-lg p-4'>
                            <div className='text-left'>
                                <h2 className='text-lg font-semibold'>Post Your Question</h2>
                                <textarea
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    className='w-full border border-gray-300 rounded-md px-3 py-2 mt-2'
                                    placeholder='Type your question here...'></textarea>
                                <div className='flex justify-end mt-2'>

                                    <Button
                                        onClick={handleSubmit}
                                        className='bg-bluePrimary hover:bg-bluePrimary text-white font-semibold py-2 px-4 rounded-md'
                                    >
                                        Submit
                                    </Button>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {response && (
                    <div className="flex justify-center">
                        <div className='w-[90%] bg-grayBackground rounded-lg p-4 mt-10'>
                            <h1>{response}</h1>
                        </div>
                    </div>
                )}

                {!response && (
                    <div className="flex justify-center">
                        <div className='w-[90%] bg-grayBackground rounded-lg p-4 mt-10'>
                            <h3 className='text-lg font-semibold mb-2'>Previous Questions</h3>
                            {previousQuestions.map((prevQuestion, index) => (
                                <div key={index} className='rounded-md border border-gray-300 my-2 bg-white p-2'>
                                    {prevQuestion}
                                </div>
                            ))}
                        </div>
                    </div>
                )}



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

export default postResponse