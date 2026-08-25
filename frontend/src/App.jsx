import { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AIAdvisor from "./pages/AIAdvisor";
import DiseaseDetection from "./pages/DiseaseDetection";
import CropRecommendations from "./pages/CropRecommendations";
import FertilizerAdvice from "./pages/FertilizerAdvice";
import Register from "./pages/Register";
function App() {
  const [user, setUser] = useState(null);

  const [isRegistering, setIsRegistering] = useState(false);

  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "English"
  );

  const [page, setPage] = useState("dashboard");

  function handleLanguageChange(newLanguage) {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  }

  function handleLogout() {
    setUser(null);
    setPage("dashboard");
  }

  if (!user) {

  if (isRegistering) {
    return (
      <Register
        language={language}
        setLanguage={handleLanguageChange}
        onBackToLogin={() =>
          setIsRegistering(false)
        }
      />
    );
  }

  return (
    <Login
      onLogin={setUser}
      language={language}
      setLanguage={handleLanguageChange}
      onRegister={() =>
        setIsRegistering(true)
      }
    />
  );
}

  if (page === "ai-advisor") {
    return (
      <AIAdvisor
        user={user}
        language={language}
        onBack={() => setPage("dashboard")}
      />
    );
  }

  if (page === "disease") {
    return (
      <DiseaseDetection
        user={user}
        language={language}
        onBack={() => setPage("dashboard")}
      />
    );
  }

  if (page === "crops") {
    return (
      <CropRecommendations
        user={user}
        language={language}
        onBack={() => setPage("dashboard")}
      />
    );
  }

  if (page === "fertilizer") {
    return (
      <FertilizerAdvice
        user={user}
        language={language}
        onBack={() => setPage("dashboard")}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      language={language}
      setLanguage={handleLanguageChange}
      onAIAdvisor={() => setPage("ai-advisor")}
      onDiseaseDetection={() => setPage("disease")}
      onCropRecommendations={() => setPage("crops")}
      onFertilizerAdvice={() => setPage("fertilizer")}
      onLogout={handleLogout}
    />
  );
}

export default App;