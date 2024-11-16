"use client";

import { useRouter } from "next/navigation";

const GetStartedButton = () => {
  const router = useRouter();

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  return (
    <button
      className="mt-4 px-8 py-2.5 text-white rounded-full shadow-md transition duration-300 bg-[#308d46] hover:bg-[#27753b]"
      onClick={handleSignUp}
    >
      Get Started
    </button>
  );
};

export default GetStartedButton;
