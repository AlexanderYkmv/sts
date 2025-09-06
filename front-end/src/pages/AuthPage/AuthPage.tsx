import { motion } from "framer-motion";
import { useState } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import SignUpForm from "../../components/SignUpForm/SignUpForm";
import type { User } from "../../components/types";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginSuccess = (user: User) => {
    // Redirect based on role
    if (user.role === "Student") window.location.href = "/student/dashboard";
    else if (user.role === "Tutor") window.location.href = "/tutor/dashboard";
    else if (user.role === "Vice_Dean") window.location.href = "/vicedean/dashboard";
    else window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-[#f3ede6]">
      <div className="flex w-1/2 flex-col justify-center items-center p-8 space-y-6 text-gray-800">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md space-y-4"
        >
          <img
            src="/Tu-sofia-logo.svg"
            alt="Technical University of Sofia Logo"
            className="w-32 h-32 mx-auto mb-2"
          />
          <h1 className="text-4xl font-bold text-gray-800">Welcome to STS!</h1>
          <p className="text-gray-600 text-lg">
            Your university thesis management system
          </p>
        </motion.div>
      </div>

      <div className="flex w-1/2 justify-center items-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg border border-gray-200 rounded-xl p-10 w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold text-center text-blue-700 mb-8">
            {isLogin ? "Login to Your Account" : "Create an Account"}
          </h2>

          {isLogin ? (
            <LoginForm onSuccess={handleLoginSuccess} />
          ) : (
            <SignUpForm onSuccess={() => setIsLogin(true)} />
          )}

          <div className="mt-6 text-center text-gray-600">
            {isLogin ? (
              <p>
                Don’t have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already registered?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}