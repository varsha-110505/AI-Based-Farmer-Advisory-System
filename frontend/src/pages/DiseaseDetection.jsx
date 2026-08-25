import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { getTranslations } from "../i18n/translations";
import "./DiseaseDetection.css";

const API_URL = "http://127.0.0.1:8000";

function DiseaseDetection({
  user,
  language = "English",
  onBack,
}) {
  const t = getTranslations(language);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError("");
  }

  async function handlePredict() {
    if (!file) {
      setError(t.disease.selectImage);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        `${API_URL}/api/disease/predict?farmer_id=${user.farmer_id}&language=${encodeURIComponent(language)}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = t.disease.detectionFailed;

        if (typeof data.detail === "string") {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMessage = data.detail
            .map(
              (item) =>
                item.msg || JSON.stringify(item)
            )
            .join(", ");
        } else if (data.message) {
          errorMessage = data.message;
        }

        throw new Error(errorMessage);
      }

      setResult(data);
    } catch (err) {
      console.error(
        "Disease detection error:",
        err
      );

      setError(
        err.message ||
          t.disease.detectionFailed
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDiseaseName(disease) {
    return disease
      ? disease.replaceAll("_", " ")
      : "Unknown";
  }

  return (
    <div className="disease-page">

      <header className="disease-header">

        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          {t.common.backToDashboard}
        </button>

        <h1>{t.disease.title}</h1>

        <p>
          {t.disease.subtitle}
        </p>

      </header>

      <main className="disease-content">

        <section className="upload-card">

          <h2>
            {t.disease.uploadTitle}
          </h2>

          <p className="upload-help">
            {t.disease.uploadHelp}
          </p>

          <label className="upload-area">

            {preview ? (
              <img
                src={preview}
                alt={t.disease.chooseImage}
                className="image-preview"
              />
            ) : (
              <>
                <div className="upload-icon">
                  📷
                </div>

                <strong>
                  {t.disease.chooseImage}
                </strong>

                <span>
                  {t.disease.fileTypes}
                </span>
              </>
            )}

            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={handleFileChange}
            />

          </label>

          {error && (
            <div className="disease-error">
              {error}
            </div>
          )}

          <button
            type="button"
            className="analyze-button"
            onClick={handlePredict}
            disabled={loading || !file}
          >
            {loading
              ? t.disease.analyzing
              : t.disease.analyze}
          </button>

        </section>

        {result && (
          <section className="result-card">

            <h2>
              {t.disease.resultTitle}
            </h2>

            <div className="result-item">
              <span>
                {t.disease.disease}
              </span>

              <strong>
                {formatDiseaseName(
                  result.disease
                )}
              </strong>
            </div>

            <div className="result-item">
              <span>
                {t.disease.confidence}
              </span>

              <strong>
                {(
                  result.confidence * 100
                ).toFixed(1)}
                %
              </strong>
            </div>

            {result.advice && (
              <div className="advice-box">

                <div className="advice-title">
                  {t.disease.advice}
                </div>

                <div className="disease-advice-content">
                  <ReactMarkdown>
                    {result.advice}
                  </ReactMarkdown>
                </div>

              </div>
            )}

          </section>
        )}

      </main>

    </div>
  );
}

export default DiseaseDetection;