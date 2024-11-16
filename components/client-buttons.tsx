"use client";

import { useRouter } from "next/navigation";

const ClientButtons = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/sign-in");
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  return (
    <div className="p-3 flex space-x-2">
      <button
        onClick={handleLogin}
        className="px-2 py-2 sm:px-4 sm:py-2 border text-black rounded-md shadow-md transition duration-300"
      >
        Login
      </button>
      <button
        onClick={handleSignUp}
        className="px-2 py-2 sm:px-4 sm:py-2 text-white rounded-md shadow-md transition duration-300 bg-[#308d46] hover:bg-[#27753b]"
      >
        Sign Up
      </button>
    </div>
  );
};

export default ClientButtons;
