import { useState } from "react";
import { loginFarmer } from "../services/api";
import { getTranslations } from "../i18n/translations";
import "./Login.css";

function Login({
  onLogin,
  language = "English",
  setLanguage,
  onRegister,
}) {
  const [farmerId, setFarmerId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = getTranslations(language);

  async function handleLogin(e) {
    e.preventDefault();

    setError("");

    if (!farmerId.trim() || !password.trim()) {
      setError(t.login.emptyFields);
      return;
    }

    try {
      setLoading(true);

      const data = await loginFarmer(
        farmerId,
        password
      );

      console.log("Login successful:", data);

      onLogin(data);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-language">
          <label htmlFor="login-language">
            {t.common.language}
          </label>

          <select
            id="login-language"
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

        <div className="login-logo">
          🌱
        </div>

        <h1>
          {t.login.title}
        </h1>

        <p className="login-subtitle">
          {t.login.subtitle}
        </p>

        <form onSubmit={handleLogin}>

          <label htmlFor="farmerId">
            {t.login.farmerId}
          </label>

          <input
            id="farmerId"
            type="text"
            placeholder={
              t.login.farmerIdPlaceholder
            }
            value={farmerId}
            onChange={(e) =>
              setFarmerId(e.target.value)
            }
          />

          <label htmlFor="password">
            {t.login.password}
          </label>

          <input
            id="password"
            type="password"
            placeholder={
              t.login.passwordPlaceholder
            }
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? t.login.loggingIn
              : t.login.login}
          </button>

        </form>

        <p className="register-text">
  {t.login.noAccount}{" "}
  <span onClick={onRegister}>
    {t.login.register}
  </span>
</p>

      </div>
    </div>
  );
}

export default Login;