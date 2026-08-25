import { useEffect, useState } from "react";
import { getFarmerProfile } from "../services/api";
import { getTranslations } from "../i18n/translations";
import "./Dashboard.css";

function Dashboard({
  user,
  language,
  setLanguage,
  onAIAdvisor,
  onDiseaseDetection,
  onCropRecommendations,
  onFertilizerAdvice,
  onLogout,
}) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const t = getTranslations(language);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getFarmerProfile(
          user.farmer_id
        );

        console.log("Farmer profile:", data);

        setProfile(data);
      } catch (err) {
        console.error("Profile error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user.farmer_id]);

  if (loading) {
    return (
      <div className="dashboard-message">
        {t.dashboard.loading}
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-message dashboard-error">
        {error}
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      <header className="dashboard-header">

        <div>
          <h1>
            {t.dashboard.title}
          </h1>

          <p>
            {t.dashboard.welcome},{" "}
            {profile?.name || user.name}!
          </p>
        </div>

        <div className="dashboard-header-actions">

          <div className="language-selector">

            <label htmlFor="dashboard-language">
              {t.common.language}
            </label>

            <select
              id="dashboard-language"
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
            >
              <option value="English">
                {t.common.english}
              </option>

              <option value="Kannada">
                {t.common.kannada}
              </option>

              <option value="Hindi">
                {t.common.hindi}
              </option>

              <option value="Tamil">
                {t.common.tamil}
              </option>
            </select>

          </div>

          <div className="farmer-id">
            Farmer ID:{" "}
            {profile?.farmer_id || user.farmer_id}
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={onLogout}
          >
            {t.common.logout}
          </button>

        </div>

      </header>

      <main className="dashboard-content">

        <section className="welcome-card">

          <h2>
            {t.dashboard.goodToSeeYou},{" "}
            {profile?.name || user.name} 👋
          </h2>

          <p>
            {t.dashboard.welcomeMessage}
          </p>

        </section>

        <section className="dashboard-grid">

          <div className="dashboard-card">

            <h3>
              📍 {t.dashboard.location}
            </h3>

            <p>
              {profile?.location?.district ||
                t.dashboard.locationUnavailable}
            </p>

            <span>
              {profile?.location?.state || ""}
            </span>

          </div>

          <div className="dashboard-card">

            <h3>
              🌦️ {t.dashboard.weather}
            </h3>

            <p>
              {profile?.weather?.temperature ?? "--"}°C
            </p>

            <span>
              {profile?.weather?.condition ||
                t.dashboard.weatherUnavailable}
            </span>

          </div>

          <div className="dashboard-card">

            <h3>
              💧 {t.dashboard.humidity}
            </h3>

            <p>
              {profile?.weather?.humidity ?? "--"}%
            </p>

            <span>
              {t.dashboard.currentHumidity}
            </span>

          </div>

          <div className="dashboard-card">

            <h3>
              💨 {t.dashboard.wind}
            </h3>

            <p>
              {profile?.weather?.wind_speed ?? "--"} m/s
            </p>

            <span>
              {t.dashboard.currentWind}
            </span>

          </div>

        </section>

        <section className="features-section">

          <h2>
            {t.dashboard.helpTitle}
          </h2>

          <div className="feature-grid">

            <div
              className="feature-card"
              onClick={onAIAdvisor}
            >
              <div className="feature-icon">
                🤖
              </div>

              <h3>
                {t.dashboard.aiAdvisor}
              </h3>

              <p>
                {t.dashboard.aiAdvisorDescription}
              </p>
            </div>

            <div
              className="feature-card"
              onClick={onCropRecommendations}
            >
              <div className="feature-icon">
                🌾
              </div>

              <h3>
                {t.dashboard.cropRecommendations}
              </h3>

              <p>
                {t.dashboard.cropRecommendationsDescription}
              </p>
            </div>

            <div
              className="feature-card"
              onClick={onDiseaseDetection}
            >
              <div className="feature-icon">
                🔬
              </div>

              <h3>
                {t.dashboard.diseaseDetection}
              </h3>

              <p>
                {t.dashboard.diseaseDetectionDescription}
              </p>
            </div>

            <div
              className="feature-card"
              onClick={onFertilizerAdvice}
            >
              <div className="feature-icon">
                🧪
              </div>

              <h3>
                {t.dashboard.fertilizerAdvice}
              </h3>

              <p>
                {t.dashboard.fertilizerAdviceDescription}
              </p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;