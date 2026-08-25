import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { sendChatMessage } from "../services/api";
import { getTranslations } from "../i18n/translations";
import "./CropRecommendations.css";

function CropRecommendations({
  user,
  language = "English",
  onBack,
}) {
  const t = getTranslations(language);

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getRecommendations() {
    try {
      setLoading(true);
      setError("");
      setResult("");

      const prompt = `
Based on my current location and weather, recommend the best crops
I can grow in my area.

Give:

### Best crop options

Recommend at most 5 crops.

For each crop:
- Give one simple reason why it may suit my area.
- Give one simple risk to watch for.

Then give:

### Practical tips

Give 2 or 3 simple tips.

Use very simple everyday language that a farmer can easily understand.
Respond entirely in ${language}.
Do not use a Markdown table.
Do not ask for information that is already available in my farmer context.
`;

      const response = await sendChatMessage(
        user.farmer_id,
        prompt,
        language
      );

      setResult(response);
    } catch (err) {
      console.error(
        "Crop recommendation error:",
        err
      );

      setError(
  err.message ||
  "Failed to get crop recommendations."
);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="crop-page">

      <header className="crop-header">

        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          {t.common.backToDashboard}
        </button>

        <h1>
          {t.crops.title}
        </h1>

        <p>
          {t.crops.subtitle}
        </p>

      </header>

      <main className="crop-content">

        {!result && !loading && (
          <section className="crop-start-card">

            <div className="crop-icon">
              🌱
            </div>

            <h2>
              {t.crops.heading}
            </h2>

            <p>
              {t.crops.description}
            </p>

            <button
              type="button"
              className="recommend-button"
              onClick={getRecommendations}
            >
              {t.crops.getRecommendations}
            </button>

          </section>
        )}

        {loading && (
          <section className="crop-start-card">

            <div className="crop-icon">
              🌱
            </div>

            <h2>
              {t.crops.finding}
            </h2>

            <p>
              {t.crops.findingDescription}
            </p>

            <div className="loading-text">
              {t.crops.pleaseWait}
            </div>

          </section>
        )}

        {error && (
          <div className="crop-error">
            {error}
          </div>
        )}

        {result && !loading && (
          <section className="crop-result-card">

            <div className="crop-result-title">
              {t.crops.aiRecommendations}
            </div>

            <div className="crop-result-content">
              <ReactMarkdown>
                {result}
              </ReactMarkdown>
            </div>

            <button
              type="button"
              className="recommend-again-button"
              onClick={getRecommendations}
            >
              {t.crops.getNew}
            </button>

          </section>
        )}

      </main>

    </div>
  );
}

export default CropRecommendations;