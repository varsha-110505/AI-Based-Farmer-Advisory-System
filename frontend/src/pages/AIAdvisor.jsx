import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { sendChatMessage } from "../services/api";
import { getTranslations } from "../i18n/translations";
import "./AIAdvisor.css";

const API_URL = "http://127.0.0.1:8000";

function AIAdvisor({
  user,
  language = "English",
  onBack,
}) {
  const t = getTranslations(language);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: t.aiAdvisor.initialMessage,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);

  const recognitionRef = useRef(null);

  // Current audio element
  const audioRef = useRef(null);

  // Current audio object URL
  const audioUrlRef = useRef(null);

  // Used to cancel/ignore older TTS requests
  const speechRequestIdRef = useRef(0);

  // ==================== VOICE INPUT ====================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      recognitionRef.current = null;
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const spokenText =
        event.results[0][0].transcript;

      setMessage((previous) =>
        previous
          ? `${previous} ${spokenText}`
          : spokenText
      );

      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event
      );

      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  function getSpeechLanguage() {
    if (language === "Kannada") {
      return "kn-IN";
    }

    if (language === "Hindi") {
      return "hi-IN";
    }

    if (language === "Tamil") {
      return "ta-IN";
    }

    return "en-IN";
  }

  function handleMicClick() {
    if (!recognitionRef.current) {
      setMessages((previous) => [
        ...previous,
        {
          sender: "ai",
          text: t.aiAdvisor.voiceNotSupported,
        },
      ]);

      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    recognitionRef.current.lang =
      getSpeechLanguage();

    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (error) {
      console.error(
        "Microphone error:",
        error
      );

      setListening(false);
    }
  }

  // ==================== TEXT TO SPEECH ====================

  function cleanTextForSpeech(text) {
    return text
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`{1,3}(.*?)`{1,3}/g, "$1")
      .replace(/^\s*[-*]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/\n+/g, ". ")
      .trim();
  }

  function stopCurrentAudio() {
    // Invalidate any pending TTS request
    speechRequestIdRef.current += 1;

    // Stop currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
      audioRef.current = null;
    }

    // Remove old object URL
    if (audioUrlRef.current) {
      URL.revokeObjectURL(
        audioUrlRef.current
      );
      audioUrlRef.current = null;
    }

    setSpeakingIndex(null);
  }

  async function handleSpeak(text, index) {
    // If this message is currently speaking,
    // clicking the button should STOP it.
    if (speakingIndex === index) {
      stopCurrentAudio();
      return;
    }

    // Stop any other audio first.
    stopCurrentAudio();

    const cleanedText =
      cleanTextForSpeech(text);

    if (!cleanedText) {
      return;
    }

    // Create a new request ID for this speech request
    const requestId =
      ++speechRequestIdRef.current;

    try {
      setSpeakingIndex(index);

      const params = new URLSearchParams({
        text: cleanedText,
        language: language,
      });

      const response = await fetch(
        `${API_URL}/api/tts/?${params.toString()}`,
        {
          method: "POST",
        }
      );

      // A newer request or stop button happened
      if (
        requestId !==
        speechRequestIdRef.current
      ) {
        return;
      }

      if (!response.ok) {
        let errorMessage =
          "Failed to generate audio.";

        try {
          const data =
            await response.json();

          if (data.detail) {
            errorMessage =
              typeof data.detail === "string"
                ? data.detail
                : JSON.stringify(
                    data.detail
                  );
          }
        } catch {
          // Ignore invalid error response
        }

        throw new Error(
          errorMessage
        );
      }

      const audioBlob =
        await response.blob();

      // Check again because the user may
      // have pressed stop while fetching.
      if (
        requestId !==
        speechRequestIdRef.current
      ) {
        return;
      }

      const audioUrl =
        URL.createObjectURL(
          audioBlob
        );

      audioUrlRef.current = audioUrl;

      const audio =
        new Audio(audioUrl);

      audioRef.current = audio;

      audio.onended = () => {
        if (
          requestId ===
          speechRequestIdRef.current
        ) {
          setSpeakingIndex(null);
        }

        if (
          audioUrlRef.current ===
          audioUrl
        ) {
          URL.revokeObjectURL(
            audioUrl
          );

          audioUrlRef.current = null;
        }

        if (
          audioRef.current ===
          audio
        ) {
          audioRef.current = null;
        }
      };

      audio.onerror = () => {
        console.error(
          "Audio playback error."
        );

        if (
          requestId ===
          speechRequestIdRef.current
        ) {
          setSpeakingIndex(null);
        }

        if (
          audioUrlRef.current ===
          audioUrl
        ) {
          URL.revokeObjectURL(
            audioUrl
          );

          audioUrlRef.current = null;
        }

        if (
          audioRef.current ===
          audio
        ) {
          audioRef.current = null;
        }
      };

      await audio.play();

    } catch (error) {
      // Ignore errors caused by cancellation
      if (
        requestId !==
        speechRequestIdRef.current
      ) {
        return;
      }

      console.error(
        "TTS error:",
        error
      );

      setSpeakingIndex(null);
    }
  }

  // Stop audio when leaving page
  useEffect(() => {
    return () => {
      stopCurrentAudio();

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // ==================== SEND MESSAGE ====================

  async function handleSend(e) {
    e.preventDefault();

    const trimmedMessage =
      message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    // Stop audio when sending a new message
    stopCurrentAudio();

    setMessages((previous) => [
      ...previous,
      {
        sender: "user",
        text: trimmedMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response =
        await sendChatMessage(
          user.farmer_id,
          trimmedMessage,
          language
        );

      setMessages((previous) => [
        ...previous,
        {
          sender: "ai",
          text: response,
        },
      ]);
    } catch (error) {
      console.error(
        "Chat error:",
        error
      );

      setMessages((previous) => [
        ...previous,
        {
          sender: "ai",
          text: `Error: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-advisor-page">

      <header className="ai-advisor-header">

        <button
          className="back-button"
          onClick={onBack}
          type="button"
        >
          {t.common.backToDashboard}
        </button>

        <h1>
          {t.aiAdvisor.title}
        </h1>

        <p>
          {t.aiAdvisor.subtitle}
        </p>

      </header>

      <main className="ai-advisor-content">

        <div className="chat-box">

          {messages.map(
            (msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "message user-message"
                    : "message assistant-message"
                }
              >

                <strong>
                  {msg.sender === "user"
                    ? t.aiAdvisor.you
                    : t.aiAdvisor.advisor}
                </strong>

                <div className="message-content">
                  <ReactMarkdown>
                    {msg.text}
                  </ReactMarkdown>
                </div>

                {msg.sender === "ai" && (
                  <button
                    type="button"
                    className={`speak-button ${
                      speakingIndex === index
                        ? "speaking"
                        : ""
                    }`}
                    onClick={() =>
                      handleSpeak(
                        msg.text,
                        index
                      )
                    }
                  >
                    {speakingIndex === index
                      ? "⏹️"
                      : "🔊"}
                  </button>
                )}

              </div>
            )
          )}

          {loading && (
            <div className="message assistant-message">

              <strong>
                {t.aiAdvisor.advisor}
              </strong>

              <p>
                {t.aiAdvisor.thinking}
              </p>

            </div>
          )}

        </div>

        <form
          className="chat-input-area"
          onSubmit={handleSend}
        >

          <button
            type="button"
            className={`mic-button ${
              listening
                ? "listening"
                : ""
            }`}
            onClick={handleMicClick}
            disabled={loading}
          >
            {listening
              ? "🛑"
              : "🎤"}
          </button>

          <input
            type="text"
            placeholder={
              t.aiAdvisor.placeholder
            }
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            disabled={loading}
          />

          <button
            type="submit"
            disabled={
              loading ||
              !message.trim()
            }
          >
            {loading
              ? "..."
              : t.aiAdvisor.send}
          </button>

        </form>

      </main>

    </div>
  );
}

export default AIAdvisor;