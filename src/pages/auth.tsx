import React from 'react'

export default function auth() {
  return (
    <div className='w-full flex items-center justify-center'>
        <div className='w-full h-100 flex items=center justify-center'>
            <div className='w-full sm:w5/6 md:w-2/3 lg:w1/2 xl:w-1/3 2xl:w-1/3 h-full bg-white items-center justify-center'>
                <h2 className='text-center text-2xl font-bold tracking-wide text-gray-800'>
                    Sign up
                </h2>
                <p className="text-center text-sm text-gray-6000 mt-2">
                    Already have an account? &nbsp;
                    <a className='text-blue-600 hover:text-blue-800 hover:underline cursor-pointer'>
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    </div>
  )
}

