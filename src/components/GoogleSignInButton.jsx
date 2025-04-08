'use client';

import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';

const GoogleSignInButton = () => {
  const loginWithGoogle = () => {
    signIn('google', { callbackUrl: 'https://nextjs-auth-vert.vercel.app/welcome' });
  };

  return (
    <button
      type="button"
      onClick={loginWithGoogle}
      className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-full shadow hover:bg-gray-100 tracking-wider hover:scale-105 transition-transform duration-200"
    >
      <FcGoogle size={22} />
      <span className="text-sm font-medium">Continue with Google</span>
    </button>
  );
};

export default GoogleSignInButton;
