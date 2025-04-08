"use client"
import { toast } from 'sonner';
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation";

const UserAccountNav = () => {
  const router = useRouter();
  return (
    <button onClick={() => {
        toast.success("Logout successful!");
        signOut({
            redirect: true,
            callbackUrl: `${window.location.origin}/login`
        });
        router.refresh(); 
    }} className="block font-medium transition duration-300 hover:bg-yellow-200 hover:text-white hover:font-bold text-gray-800 py-2 px-4 rounded-full ease-in-out transform hover:scale-105">
    Logout
  </button>
  )
}

export default UserAccountNav;