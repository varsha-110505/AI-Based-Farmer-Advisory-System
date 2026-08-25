import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { sendChatMessage } from "../services/api";
import { getTranslations } from "../i18n/translations";
import "./FertilizerAdvice.css";

function FertilizerAdvice({
  user,
  language = "English",
  onBack,
}) {
  const t = getTranslations(language);

  const [crop, setCrop] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getAdvice() {
    if (!crop) {
      setError(t.fertilizer.selectFirst);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult("");

      const prompt = `
Give simple fertilizer advice for the farmer's crop: ${crop}.

Use the farmer's stored location and current weather context.

Write for a farmer using very simple everyday language.

Respond entirely in ${language}.

Use exactly these sections:

### Fertilizer advice
Explain the main nutrients the crop generally needs.

### When to apply
Explain simply when fertilizer is usually given.

### How to apply
Give safe, general guidance about applying fertilizer.

### Important tips
Give 2 or 3 useful tips.

Rules:
- Do not use Markdown tables.
- Keep the answer concise and easy to read.
- Avoid difficult scientific words.
- If a technical word is necessary, explain it simply.
- Do not recommend exact fertilizer brands, exact fertilizer ratios,
  or exact quantities.
- Do not recommend pesticide or chemical doses.
- Tell the farmer to use a soil test or local agricultural advice
  when an exact fertilizer amount is needed.
- Do not recommend mixing fertilizer with water into a paste or
  applying it directly to roots.
`;

      const response = await sendChatMessage(
        user.farmer_id,
        prompt,
        language
      );

      setResult(response);
    } catch (err) {
      console.error(
        "Fertilizer advice error:",
        err
      );

      setError(
        err.message ||
          "Failed to get fertilizer advice."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fertilizer-page">

      <header className="fertilizer-header">

        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          {t.common.backToDashboard}
        </button>

        <h1>
          {t.fertilizer.title}
        </h1>

        <p>
          {t.fertilizer.subtitle}
        </p>

      </header>

      <main className="fertilizer-content">

        <section className="fertilizer-card">

          <div className="fertilizer-icon">
            🧪
          </div>

          <h2>
            {t.fertilizer.selectCrop}
          </h2>

          <p>
            {t.fertilizer.chooseCrop}
          </p>

          <select
            value={crop}
            onChange={(e) => {
              setCrop(e.target.value);
              setError("");
              setResult("");
            }}
          >
            <option value="">
              {t.fertilizer.selectCropPlaceholder}
            </option>

            <option value="Tomato">
              {t.fertilizer.tomato}
            </option>

            <option value="Maize">
              {t.fertilizer.maize}
            </option>

            <option value="Ragi">
              {t.fertilizer.ragi}
            </option>

            <option value="Cucumber">
              {t.fertilizer.cucumber}
            </option>

            <option value="Brinjal">
              {t.fertilizer.brinjal}
            </option>

            <option value="Beans">
              {t.fertilizer.beans}
            </option>

            <option value="Green gram">
              {t.fertilizer.greenGram}
            </option>

            <option value="Chickpea">
              {t.fertilizer.chickpea}
            </option>
          </select>

          {error && (
            <div className="fertilizer-error">
              {error}
            </div>
          )}

          <button
            type="button"
            className="fertilizer-button"
            onClick={getAdvice}
            disabled={loading}
          >
            {loading
              ? t.fertilizer.gettingAdvice
              : t.fertilizer.getAdvice}
          </button>

        </section>

        {loading && (
          <section className="fertilizer-result loading-card">

            <div className="fertilizer-icon">
              🌱
            </div>

            <h3>
              {t.fertilizer.preparing}
            </h3>

            <p>
              {t.fertilizer.preparingDescription}
            </p>

          </section>
        )}

        {result && !loading && (
          <section className="fertilizer-result">

            <div className="fertilizer-result-title">
              {t.fertilizer.adviceFor} {crop}
            </div>

            <div className="fertilizer-result-content">
              <ReactMarkdown>
                {result}
              </ReactMarkdown>
            </div>

            <button
              type="button"
              className="fertilizer-again-button"
              onClick={getAdvice}
            >
              {t.fertilizer.getAgain}
            </button>

          </section>
        )}

      </main>

    </div>
  );
}

export default FertilizerAdvice;