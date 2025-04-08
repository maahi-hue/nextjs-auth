'use client';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import React from 'react';
import { toast } from 'sonner';
import GoogleSignInButton from '@/components/GoogleSignInButton';


const registerSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const Register = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      toast.success("Registration successful!");
      router.push('/login');
    } else {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-orange-400 to-pink-500 mt-16">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 uppercase tracking-wide">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 bg-white shadow-sm">
              <FaUser className="text-gray-500 mr-3" />
              <input
                type="text"
                placeholder="Username"
                {...register('username')}
                className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400"
              />
            </div>
            {errors.username && (
              <span className="text-sm text-red-500 ml-4">
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 bg-white shadow-sm">
              <FaEnvelope className="text-gray-500 mr-3" />
              <input
                type="email"
                placeholder="Email"
                {...register('email')}
                className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400"
              />
            </div>
            {errors.email && (
              <span className="text-sm text-red-500 ml-4">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 bg-white shadow-sm">
              <FaLock className="text-gray-500 mr-3" />
              <input
                type="password"
                placeholder="Password"
                {...register('password')}
                className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400"
              />
            </div>
            {errors.password && (
              <span className="text-sm text-red-500 ml-4">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF4B2B] text-white py-3 rounded-full font-bold uppercase text-sm tracking-wider hover:scale-105 transition-transform duration-200"
          >
            Sign Up
          </button>

          <GoogleSignInButton>Sign in with Google</GoogleSignInButton>
        </form>

        <p className="text-center text-gray-700 mt-6 text-sm">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-[#FF4B2B] font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
