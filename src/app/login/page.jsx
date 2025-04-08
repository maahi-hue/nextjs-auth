'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import GoogleSignInButton from '@/components/GoogleSignInButton';



// Schema using zod
const FormSchema = z.object({
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const Login = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
   const signInData = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (signInData?.error) {
      toast.error("Something went wrong!");
    } else {

      router.refresh(); 
      router.push('/welcome'); 
      toast.success("Login successful!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 to-orange-400 mt-16">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-sm w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 uppercase tracking-wide">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              {...register('email')}
              placeholder="Enter your email"
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 bg-white shadow-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1 ml-2">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              {...register('password')}
              placeholder="Enter your password"
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 bg-white shadow-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1 ml-2">{errors.password.message}</p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#FF4B2B] text-white py-3 rounded-full font-bold uppercase text-sm tracking-wider hover:scale-105 transition-transform duration-200"
          >
            Login
          </button>

          <GoogleSignInButton>Sign in with Google</GoogleSignInButton>
        </form>

        {/* Links */}
        <div className="text-center mt-6 text-sm">
          <a href="/forgot-password" className="text-[#FF4B2B] hover:underline font-medium">
            Forgot Password?
          </a>
        </div>
        <p className="text-center text-gray-700 mt-6 text-sm">
          Don't have an account?{' '}
          <a href="/register" className="text-[#FF4B2B] font-medium hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
