import React from 'react'

import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import { FaSquareXTwitter } from "react-icons/fa6";

const LoginForm = ({ }) => {
  

  return (
    <div className='flex flex-col justify-between  h-screen' style={{backgroundImage:"url('https://static.vecteezy.com/system/resources/previews/032/854/832/non_2x/modern-television-studio-for-world-breaking-news-with-equipment-for-leading-reporters-and-announcers-free-photo.jpg')",backgroundSize:'cover', backgroundRepeat:'no-repeat'}}>
        
    <div className='flex justify-center items-center h-full   '>
        <div className=" h-[80%] max-w-md p-8 space-y-3 rounded-xl bg-gray-100 opacity-90 text-black shadow-black">
            <h1 className="text-2xl font-bold text-center">Login</h1>
            <form  action="" className="space-y-6">
                <div className="space-y-1 text-sm">
                    <label htmlFor="username" className="block dark:text-gray-600">Username</label>
                    <input type="text" name="username" id="username" placeholder="Username" className="w-full px-4 py-3 rounded-md border-2 border-black opacity-100 bg-white text-gray-800 " />
                </div>
                <div className="space-y-1 text-sm">
                    <label htmlFor="password" className="block text-gray-600">Password</label>
                    <input type="password" name="password" id="password" placeholder="Password" className="w-full px-4 py-3 rounded-md border-2  border-black bg-white text-gray-800 " />
                    <div className="flex justify-end text-xs dark:text-gray-600">
                        <a rel="noopener noreferrer" href="#">Forgot Password?</a>
                    </div>
                </div>
                <button  className="block w-full  p-3 text-center rounded-sm text-gray-50 bg-blue-600 active:bg-blue-700">Sign in</button>
            </form>
            <div className="flex items-center pt-4 space-x-1">
                <div className="flex-1 h-px sm:w-16 dark:bg-gray-300"></div>
                <p className="px-3 text-sm dark:text-gray-600">Login with social accounts</p>
                <div className="flex-1 h-px sm:w-16 dark:bg-gray-300"></div>
            </div>
            <div className="flex justify-center space-x-4">
                <button aria-label="Log in with Google"  className="  p-1 rounded active:bg-gray-500 ">
                <FcGoogle className='size-6' />
                </button>
                <button aria-label="Log in with GitHub" className="p-1 rounded active:bg-gray-500">
            <SiGithub className='size-6'/>
                </button>
            <button aria-label="Log in with GitHub" className="p-1 rounded active:bg-gray-500">
            <FaSquareXTwitter  className='size-6'/>
                </button>
            </div>
           
        </div>
    </div>
    <div>
    
    </div>
    
</div>
  );
};

export default LoginForm;
