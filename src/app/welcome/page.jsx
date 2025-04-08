import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const Page = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-r from-orange-400 to-pink-500 px-4 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 bottom-0 z-0">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
        <div className="shape shape4"></div>
      </div>

      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg z-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 animate-fall-down">
          {session?.user ? `Welcome, ${session.user.username || session.user.name}!` : "You are not logged in!"}
        </h2>
        <div className="text-center">
          {session?.user ? (
            <div className="text-lg text-gray-600 animate-fall-down delay-200">
              Enjoy exploring!
            </div>
          ) : (
            <div className="text-lg text-gray-600 animate-fall-down delay-200">
              Please log in to access all features.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
