import { useState } from "react";
import { registerFarmer } from "../services/api";
import { getTranslations } from "../i18n/translations";
import "./Register.css";

function Register({
  language = "English",
  setLanguage,
  onBackToLogin,
}) {
  const t = getTranslations(language);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [pincode, setPincode] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [farmerId, setFarmerId] = useState(null);

  async function handleRegister(e) {
    e.preventDefault();

    setError("");
    setFarmerId(null);

    if (
      !name.trim() ||
      !phone.trim() ||
      !password.trim() ||
      !pincode.trim()
    ) {
      setError(t.register.fillAll);
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError(t.register.invalidPhone);
      return;
    }

    if (password.length < 6) {
      setError(t.register.shortPassword);
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setError(t.register.invalidPincode);
      return;
    }

    try {
      setLoading(true);

      const data = await registerFarmer(
        name.trim(),
        phone.trim(),
        password,
        language,
        pincode.trim()
      );

      setFarmerId(data.farmer_id);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ==================== SUCCESS SCREEN ====================

  if (farmerId) {
    return (
      <div className="register-page">
        <div className="register-card">

          <div className="register-logo">
            🌱
          </div>

          <h1>
            {t.register.successTitle}
          </h1>

          <p className="register-success-text">
            {t.register.successMessage}
          </p>

          <div className="farmer-id-box">
            <span>
              {t.register.farmerId}
            </span>

            <strong>
              {farmerId}
            </strong>
          </div>

          <p className="register-important">
            {t.register.saveId}
          </p>

          <button
            type="button"
            onClick={onBackToLogin}
          >
            {t.register.goToLogin}
          </button>

        </div>
      </div>
    );
  }

  // ==================== REGISTER FORM ====================

  return (
    <div className="register-page">

      <div className="register-card">

        <div className="register-language">
          <label htmlFor="register-language">
            {t.common.language}
          </label>

          <select
            id="register-language"
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

        <div className="register-logo">
          🌱
        </div>

        <h1>
          {t.register.title}
        </h1>

        <p className="register-subtitle">
          {t.register.subtitle}
        </p>

        <form onSubmit={handleRegister}>

          {/* NAME */}

          <label htmlFor="name">
            {t.register.name}
          </label>

          <input
            id="name"
            type="text"
            placeholder={
              t.register.namePlaceholder
            }
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          {/* PHONE */}

          <label htmlFor="phone">
            {t.register.phone}
          </label>

          <input
            id="phone"
            type="tel"
            placeholder={
              t.register.phonePlaceholder
            }
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value.replace(/\D/g, "")
              )
            }
            maxLength={10}
          />

          {/* PASSWORD */}

          <label htmlFor="password">
            {t.register.password}
          </label>

          <input
            id="password"
            type="password"
            placeholder={
              t.register.passwordPlaceholder
            }
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {/* PINCODE */}

          <label htmlFor="pincode">
            {t.register.pincode}
          </label>

          <input
            id="pincode"
            type="text"
            placeholder={
              t.register.pincodePlaceholder
            }
            value={pincode}
            onChange={(e) =>
              setPincode(
                e.target.value.replace(/\D/g, "")
              )
            }
            maxLength={6}
          />

          {/* ERROR */}

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? t.register.creatingAccount
              : t.register.createAccount}
          </button>

        </form>

        <p className="back-login-text">
          {t.register.alreadyAccount}{" "}
          <span onClick={onBackToLogin}>
            {t.register.login}
          </span>
        </p>

      </div>

    </div>
  );
}

export default Register;