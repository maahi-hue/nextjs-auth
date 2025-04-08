"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { toast } from 'sonner';

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const sendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      const response = await fetch("/api/generate-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send OTP.");

      setMessage(data.message);
      setOtpSent(true);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }
  
    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "OTP verification failed.");
  
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("email", email);
      toast.success("OTP verified successfully! Redirecting...");
  
      const loginResponse = await signIn("credentials", {
        redirect: false,
        email: email,
      });
  
      if (loginResponse?.error) {
        toast.error("Login failed. Please try again.");
        return;
      }
  
      setTimeout(() => router.push("/welcome"), 1000);
    } catch (error) {
      setMessage(error.message);
    }
  };
  
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-orange-400 to-pink-500 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 uppercase tracking-wide">
          {otpSent ? "Verify OTP" : "Forgot Password"}
        </h2>

        {!otpSent ? (
          <>
            <div className="relative mb-5">
              <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 bg-white shadow-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>

            <button
              onClick={sendOtp}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-semibold transition-all duration-300"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <div className="relative mb-5">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400" />
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 bg-white shadow-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-pink-400 focus:outline-none"
              />
            </div>

            <button
              onClick={verifyOtp}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-full font-semibold transition-all duration-300"
            >
              Verify OTP
            </button>
          </>
        )}

        {message && <p className="text-center text-red-500 mt-4">{message}</p>}

        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <a href="/login" className="text-orange-500 hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
