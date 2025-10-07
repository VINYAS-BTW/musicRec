"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, User } from "lucide-react";
import axios from "axios";

export default function Preferences({ username, onContinue }) {
  const genres = [
    { name: "Pop", image: "./src/assets/pop.jpg", color: "from-pink-500 to-rose-500" },
    { name: "Rock", image: "./src/assets/rock.jpg", color: "from-red-500 to-orange-500" },
    { name: "Jazz", image: "./src/assets/jazz.jpg", color: "from-yellow-500 to-amber-500" },
    { name: "Classical", image: "./src/assets/classical.jpg", color: "from-blue-500 to-indigo-500" },
    { name: "Hip Hop", image: "./src/assets/hiphop.jpg", color: "from-purple-500 to-violet-500" },
    { name: "EDM", image: "./src/assets/edm.jpg", color: "from-cyan-500 to-blue-500" },
    { name: "R&B", image: "./src/assets/rnb.jpeg", color: "from-fuchsia-500 to-pink-500" },
    { name: "Country", image: "./src/assets/smtg.jpg", color: "from-orange-500 to-red-500" },
  ];

  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleGenre = (genreName) => {
    setSelected((prev) =>
      prev.includes(genreName)
        ? prev.filter((g) => g !== genreName)
        : [...prev, genreName]
    );
  };

  // ✅ Properly defined handler
  const handleContinue = async () => {
    if (selected.length === 0) return alert("Please select at least one genre");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/users/preferences", {
        username,
        preferences: selected,
      });

      console.log("✅ Preferences saved:", selected);
      onContinue(selected); // ← Tell parent to move to MainPage
    } catch (err) {
      console.error("❌ Error saving preferences:", err);
      alert("Failed to save preferences — check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-300 to-indigo-300 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <User className="w-6 h-6 text-indigo-900" />
            <span className="text-slate-900 font-nunito">Welcome, {username}!</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Choose Your Music Vibe</h1>
          <p className="text-slate-900 text-lg font-nunito">
            Select your favorite genres to personalize your experience
          </p>
          {selected.length > 0 && (
            <p className="text-indigo-800 mt-2 font-medium">
              {selected.length} genre{selected.length !== 1 ? "s" : ""} selected
            </p>
          )}
        </motion.div>

        {/* Genre Grid */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10"
        >
          {genres.map((genre) => {
            const isSelected = selected.includes(genre.name);
            return (
              <motion.button
                key={genre.name}
                onClick={() => toggleGenre(genre.name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                  isSelected
                    ? `border-transparent shadow-lg scale-105`
                    : "border-slate-700 hover:border-slate-500"
                }`}
              >
                <div className="absolute inset-0">
                  <img
                    src={genre.image}
                    alt={genre.name}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${
                      isSelected
                        ? `${genre.color} opacity-70`
                        : "from-black/60 to-transparent"
                    }`}
                  />
                </div>
                <div className="relative z-10 flex flex-col items-center justify-end h-40 p-4">
                  <span
                    className={`font-semibold text-lg ${
                      isSelected ? "text-white" : "text-slate-200"
                    }`}
                  >
                    {genre.name}
                  </span>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md"
                  >
                    <svg
                      className="w-4 h-4 text-indigo-600"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <button
            onClick={handleContinue}
            disabled={selected.length === 0 || loading}
            className={`px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 transition-all ${
              selected.length === 0 || loading
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-lg hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
            }`}
          >
            {loading ? "Saving..." : "Continue to Music"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
