"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Music3, ArrowRight } from "lucide-react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return alert("Please enter a username");

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      console.log(" User logged in:", data);

      onLogin(data.username);
    } catch (err) {
      console.error(" Error:", err);
      alert("Server error — check backend connection");
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col justify-center w-full lg:w-1/2 px-8 py-12 lg:px-24"
      >
        <div className="mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src="./src/assets/logomusicrec.png"
                alt="MusicRec Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-4xl font-bold text-slate-900 font-nunito">
              MusicRec
              <span className="text-lg mx-2 text-slate-500 font-nunito"> From AiRec </span>
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Login to Your Account
          </h1>
          <p className="text-slate-500 text-base">
            The Faster you Login, The Faster we get to work
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-full px-4 py-3.5 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                  isFocused
                    ? "border-slate-900 ring-1 ring-slate-900"
                    : "border-slate-300"
                }`}
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSubmit}
            className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
          >
            Login
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">OR</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-medium text-slate-700">Google</span>
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span className="text-sm font-medium text-slate-700">GitHub</span>
            </button>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          Don't Have An Account?{" "}
          <a href="#" className="text-slate-900 font-medium hover:underline">
            Sign Up
          </a>
        </p>
      </motion.div>
      {/* {yeno try madhe - yt op} */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0.3 }}
              animate={{
                scaleY: [0.3, 1, 0.5, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
              className="w-8 bg-white rounded-full"
              style={{ height: "60%" }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/30 to-pink-600/50" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative z-10 text-center px-12"
        >
          <h2 className="text-7xl font-bold text-white mb-4 leading-tight font-serif ">
            Welcome
            <br />
            to MusicRec!
          </h2>
          <h3 className="text-2xl  text-neutral-300 mb-4 leading-tight font-nunito">
            {" "}
            -Powered by AiRec
          </h3>
        </motion.div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute top-12 right-24"
        >
          <div className="relative">
            <div className="w-24 h-24 bg-slate-900 rounded-full shadow-2xl flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-lg" />
            </div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-2 h-8 bg-slate-800 rounded-full" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="absolute bottom-24 right-32"
        >
          <div className="w-32 h-20 bg-slate-900/80 rounded-lg backdrop-blur-sm" />
        </motion.div>
      </motion.div>
    </div>
  );
}
