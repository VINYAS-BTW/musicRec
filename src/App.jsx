import { useState } from "react";
import Login from "../components/Login";
import Preferences from "../components/Preference";
import MainPage from "../components/MainPage";
import { GoogleGenAI, Type } from "@google/genai";

export default function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [username, setUsername] = useState("");
  const [preferences, setPreferences] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [newRecommendations, setNewRecommendations] = useState([]); // NEW
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
 const [loadingNewRecommendations, setLoadingNewRecommendations] = useState(false);
 //const [dislikeCounts, setDislikeCounts] = useState({});

  // When user logs in
  const handleLogin = async (name) => {
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name }),
      });
      const data = await res.json();

      setUsername(data.username);
      setPreferences(data.preferences || []);

      if (data.preferences && data.preferences.length > 0) {
        setCurrentPage("main");
        generateRecommendation(data.preferences);
        generateNewRecommendation(data.preferences); // NEW
      } else {
        setCurrentPage("preferences");
      }
    } catch (err) {
      console.error("Login error:", err);
      setUsername(name);
      setCurrentPage("preferences");
    }
  };

  // When user sets preferences
  const handlePreferences = async (selected) => {
    setPreferences(selected);
    try {
      await fetch("http://localhost:5000/api/users/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, preferences: selected }),
      });
      generateRecommendation(selected);
      generateNewRecommendation(selected); // NEW
    } catch (err) {
      console.error("Failed to save preferences:", err);
    }
    setCurrentPage("main");
  };

  // When user goes back to login
  const handleGoBack = () => {
    setUsername("");
    setPreferences([]);
    setRecommendations([]);
    setNewRecommendations([]); // NEW
    setCurrentPage("login");
    localStorage.removeItem("username");
  };

  // Fetch recommendations from Gemini
  async function generateRecommendation(prefArr) {
    setLoadingRecommendations(true);
    console.log("Generating recommendations for preferences:", prefArr);
    try {
      const userPreferences = prefArr.join(", ");
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents:`List 10 most popular,most viewed,latest or all time favourite songs of these genres: ${userPreferences}. Only give the song name as a string array. Do not include any image links or URLs.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type:Type.STRING
            },
          },
        },
      });
    const songNames = JSON.parse(response.text);
    const recommendationsWithInfo = await Promise.all(
      songNames.map(async (songName) => {
        const info = await fetchItunesInfo(songName);
        return {
          songName,
          imagelinks: info.image,
          genre: info.genre,
          artist: info.artist,
        };
      })
    );
    setRecommendations(recommendationsWithInfo);
  } catch (err) {
    console.error("Error generating recommendations:", err);
  }
  setLoadingRecommendations(false);
  }

  // Fetch "Try Something New" recommendations from Gemini
  async function generateNewRecommendation(prefArr) {
    setLoadingNewRecommendations(true);
    try {
      const userPreferences = prefArr.join(", ");
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `List 10 most popular and most viewed songs from genres NOT in: ${userPreferences}. Only give the song name as a string array. Do not include any image links or URLs.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
               type: Type.STRING 
            },
          },
        },
      });
    const songNames = JSON.parse(response.text);
    const newRecommendationsWithInfo = await Promise.all(
      songNames.map(async (songName) => {
        const info = await fetchItunesInfo(songName);
        return {
          songName,
          imagelinks: info.image,
          genre: info.genre,
          artist: info.artist,
        };
      })
    );
    setNewRecommendations(newRecommendationsWithInfo);
  } catch (err) {
    console.error("Error generating new recommendations:", err);
  }
  setLoadingNewRecommendations(false);
  
  
}



function handleLike(item) {
  if (item.genre && !preferences.includes(item.genre)) {
    const updated = [...preferences, item.genre];
    setPreferences(updated);
    updatePreferencesInDB(updated);
  }
}


function handleDislike(item) {
  if (item.genre) {
    const updated = preferences.filter(pref => pref !== item.genre);
    setPreferences(updated);
    updatePreferencesInDB(updated);
  }
}
/*function handleDislike(item) {
  const song = item.songName;
  setDislikeCounts(prev => {
    const count = (prev[song] || 0) + 1;
    const updated = { ...prev, [song]: count };
    // If disliked 3 times, remove from preferences
    if (count >= 3) {
      const updatedPrefs = preferences.filter(pref => pref !== song);
      setPreferences(updatedPrefs);
      updatePreferencesInDB(updatedPrefs);
    }
    return updated;
  });
}*/

async function updatePreferencesInDB(updatedPrefs) {
  await fetch("http://localhost:5000/api/users/preferences", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, preferences: updatedPrefs }),
  });
  // Refresh recommendations
  //generateRecommendation(updatedPrefs);
  //generateNewRecommendation(updatedPrefs);
}



async function fetchItunesInfo(songName) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(songName)}&entity=song&limit=1`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        image: result.artworkUrl100 || result.artworkUrl60,
        genre: result.primaryGenreName || "",
        artist: result.artistName || "",
      };
    }
  } catch {}
  return {
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Music_Icon.png",
    genre: "",
    artist: "",
  };
}

  return (
    <div className="font-nunito antialiased">
      {currentPage === "login" && <Login onLogin={handleLogin} />}
      {currentPage === "preferences" && (
        <Preferences username={username} onContinue={handlePreferences} />
      )}
      {currentPage === "main" && (
        <MainPage
          username={username}
          preferences={preferences}
          recommendations={recommendations}
          newRecommendations={newRecommendations}
          loadingRecommendations={loadingRecommendations}
          loadingNewRecommendations={loadingNewRecommendations}
          onGoBack={handleGoBack}
          onLike={handleLike}
          onDislike={handleDislike}
        />
      )}
    </div>
  );
}