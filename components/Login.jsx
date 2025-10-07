"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Music, LogIn } from "lucide-react";

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
      console.log("✅ User logged in or created:", data);

      // Save username locally
      localStorage.setItem("username", data.username);

      // Pass the username to parent (App.jsx)
      onLogin(data.username);
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Server error — check backend connection");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden font-[var(--font-nunito)] bg-gradient-to-b from-neutral-50 to-indigo-300 text-black"
    >
      {/* Animated background gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.25)_0%,transparent_60%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.25)_0%,transparent_60%)] animate-pulse"></div>

      {/* Decorative blur orbs */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.25 }}
        transition={{ duration: 2 }}
        className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.25 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />

      {/* Login card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-8 py-10 bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center"
      >
        {/* Logo + Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="bg-gradient-to-br from-indigo-500 to-pink-500 p-5 rounded-full mb-5 shadow-lg shadow-indigo-500/40">
            <Music className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 font-nunito">
            MusicRec
          </h1>
          <p className="text-slate-900 mt-2 text-center text-sm">
            Step into your personalized music journey 🎧
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-full"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Username
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-slate-200 focus:outline-none transition-all ${
                  isFocused
                    ? "border-indigo-500 ring-2 ring-indigo-500/50"
                    : "border-slate-700"
                }`}
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/40 transition-all"
            >
              <LogIn className="w-5 h-5 font-nunito" />
              Continue
            </motion.button>
          </div>
        </motion.form>

        <p className="text-slate-900 text-sm text-center mt-8 font-nunito">
          Discover music tailored just for you
        </p>
      </motion.div>
    </motion.div>
  );
}
