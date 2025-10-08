"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Music2, Sparkles, TrendingUp, ArrowLeft, LogOut } from "lucide-react";
import MusicRow from "../components/MusicrRow";

export default function MainPage({
  username,
  preferences,
  recommendations,
  newRecommendations,
  loadingRecommendations,
  loadingNewRecommendations,
  onGoBack,
  onLike,
  onDislike,
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* header */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* logo */}
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src="./src/assets/logomusicrec.png"
                alt="MusicRec Logo"
                className="w-full h-full object-cover"
              />
            </div>
              <span className="text-xl font-bold text-slate-900">MusicRec</span>
            </div>

            {/* balgade prof */}
            <div className="flex items-center gap-3">
              <button
                onClick={onGoBack}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              {/* handsome prof */}
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="w-9 h-9 bg-slate-900 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-900 hidden sm:block">
                  {username}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* section-namskara */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* namskara */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-3">
                Welcome back, {username}
              </h1>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-sm">Your preferences:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {preferences.slice(0, 3).map((pref, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full"
                    >
                      {pref}
                    </span>
                  ))}
                  {preferences.length > 3 && (
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">
                      +{preferences.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* namma rec */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12"
        >
          {loadingRecommendations ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                <span className="text-slate-600 text-sm">Loading recommendations...</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-slate-900" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Our Recommendation based on Your Preferences
                </h2>
              </div>
              <MusicRow
                title="Based on Your Preferences"
                items={recommendations}
                icon={Sparkles}
                onLike={onLike}
                onDislike={onDislike}
              />
            </div>
          )}
        </motion.div>

        {/* madhya line */}
        <div className="border-t border-slate-200 my-12" />

        {/* hosa music section  */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {loadingNewRecommendations ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                <span className="text-slate-600 text-sm">Loading something new...</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-slate-900" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Try Something New
                </h2>
              </div>
              <MusicRow
                title="Try Something New"
                items={newRecommendations}
                icon={TrendingUp}
                onLike={onLike}
                onDislike={onDislike}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}