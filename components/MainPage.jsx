"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Music, Sparkles, TrendingUp, ArrowLeft } from "lucide-react";
import MusicRow from "../components/MusicrRow";




export default function MainPage({  username,
  preferences,
  recommendations,
  newRecommendations,
  loadingRecommendations,
  loadingNewRecommendations,
  onGoBack,
  onLike,
  onDislike, }) {
  /*const [recommendations,setRecommdations] = useState([
    "Summer Vibes",
    "Midnight Jazz",
    "Workout Energy",
    "Chill Beats",
    "Party Hits",
    "Focus Mode",
  ]);

  const [newMusic,setnewMusic] = useState([
    "Cosmic Dreams",
    "Urban Pulse",
    "Ocean Waves",
    "Thunder Storm",
    "Neon Lights",
    "Desert Wind",
  ]);
  */

  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-white to-indigo-200 py-10 px-6 font-nunito text-slate-900 relative"
    >
      <div className="max-w-7xl mx-auto relative">
        {/* 🔙 Back Button */}
        <motion.button
          onClick={onGoBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-0 left-0 flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-md hover:shadow-lg border border-slate-200 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-indigo-700" />
          <span className="text-sm font-semibold text-indigo-800">Back</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-12 pt-10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2 font-nunito">
                Welcome back, {username}
              </h1>
              <p className="text-slate-900 font-nunito">
                Based on your preferences:{" "}
                <span className="font-medium text-slate-900">
                  {preferences.slice(0, 3).join(", ")}
                </span>
                {preferences.length > 3 && (
                  <span className="text-slate-900">
                    {" "}
                    +{preferences.length - 3} more
                  </span>
                )}
              </p>
            </div>
            <div className="bg-indigo-600 p-3 rounded-full shadow-md">
              <Music className="w-8 h-8 text-neutral-900" />
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-indigo-300 to-transparent rounded-full" />
        </motion.div>

        {/* Music Rows */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          {loadingRecommendations ? (
            <div className="flex items-center justify-center py-10">
              <span className="animate-spin mr-2">🎵</span>
              <span>Loading recommendations...</span>
            </div>
          ) : (
            <MusicRow
              title="Based on Your Preferences"
              items={recommendations}
              icon={Sparkles}
              onLike={onLike}
              onDislike={onDislike}
            />
          )}
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-10"
        >
          {loadingNewRecommendations ? (
            <div className="flex items-center justify-center py-10">
              <span className="animate-spin mr-2">✨</span>
              <span>Loading something new...</span>
            </div>
          ) : (
            <MusicRow
              title="Try Something New"
              items={newRecommendations}
              icon={TrendingUp}
              onLike={onLike}
              onDislike={onDislike}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
