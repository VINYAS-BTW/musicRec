"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export default function Preferences({ username, onContinue }) {
  const genres = [
    { name: "Pop", image: "./src/assets/pop.jpg", color: "slate" },
    { name: "Rock", image: "./src/assets/rock.jpg", color: "slate" },
    { name: "Jazz", image: "./src/assets/jazz.jpg", color: "slate" },
    { name: "Classical", image: "./src/assets/classical.jpg", color: "slate" },
    { name: "Hip Hop", image: "./src/assets/hiphop.jpg", color: "slate" },
    { name: "EDM", image: "./src/assets/edm.jpg", color: "slate" },
    { name: "R&B", image: "./src/assets/rnb.jpeg", color: "slate" },
    { name: "Country", image: "./src/assets/smtg.jpg", color: "slate" },
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

  const handleContinue = async () => {
    if (selected.length === 0) return alert("Please select at least one genre");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          preferences: selected,
        }),
      });

      if (!response.ok) throw new Error("Failed to save preferences");

      console.log(" Preferences saved:", selected);
      onContinue(selected);
    } catch (err) {
      console.error(" Error saving preferences:", err);
      alert("Failed to save preferences — check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-slate-900 rounded-full" />
              <span className="text-sm text-slate-600">Welcome, {username}</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Choose Your Music Preferences
            </h1>
            <p className="text-slate-500 text-base">
              Select your favorite genres to get personalized recommendations
            </p>
          </motion.div>
        </div>
      </div>

      {/* main anko */}
      <div className="max-w-6xl mx-auto px-6 py-12 ">
        {/* choose the following */}
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8  inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg"
          >
            <Check className="w-4 h-4 text-slate-700" />
            <span className="text-sm font-medium text-slate-700">
              {selected.length} genre{selected.length !== 1 ? "s" : ""} selected
            </span>
          </motion.div>
        )}

        {/* types of genre */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 "
        >
          {genres.map((genre, index) => {
            const isSelected = selected.includes(genre.name);
            return (
              <motion.button
                key={genre.name}
                onClick={() => toggleGenre(genre.name)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "border-slate-900 shadow-lg"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* pics */}
                <div className="relative h-48">
                  <img
                    src={genre.image}
                    alt={genre.name}
                    className="w-full h-full object-cover"
                  />
                  {/* shoki */}
                  <div
                    className={`absolute inset-0 transition-all duration-300 ${
                      isSelected
                        ? "bg-slate-900/60"
                        : "bg-gradient-to-t from-black/70 via-black/30 to-transparent"
                    }`}
                  />
                </div>

                {/* Genre hesru */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="font-semibold text-lg text-white">
                    {genre.name}
                  </span>
                </div>

                {/* shoki 2 */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-3 right-3 w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* mundhe sagu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end"
        >
          <button
            onClick={handleContinue}
            disabled={selected.length === 0 || loading}
            className={`px-8 py-3.5 rounded-lg  cursor-pointer font-medium flex items-center gap-2 transition-all ${
              selected.length === 0 || loading
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? "Saving..." : "Continue"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}