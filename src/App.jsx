"use client";
import { useState } from "react";
import Login from "../components/Login";
import Preferences from "../components/Preference";
import MainPage from "../components/MainPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [username, setUsername] = useState("");
  const [preferences, setPreferences] = useState([]);

  // ✅ When user logs in
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
      } else {
        setCurrentPage("preferences");
      }
    } catch (err) {
      console.error("Login error:", err);
      setUsername(name);
      setCurrentPage("preferences");
    }
  };

  // ✅ When user sets preferences
  const handlePreferences = async (selected) => {
    setPreferences(selected);
    try {
      await fetch("http://localhost:5000/api/users/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, preferences: selected }),
      });
    } catch (err) {
      console.error("Failed to save preferences:", err);
    }
    setCurrentPage("main");
  };

  // ✅ When user goes back to login
  const handleGoBack = () => {
    setUsername("");
    setPreferences([]);
    setCurrentPage("login");
    localStorage.removeItem("username");
  };

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
          onGoBack={handleGoBack}
        />
      )}
    </div>
  );
}
