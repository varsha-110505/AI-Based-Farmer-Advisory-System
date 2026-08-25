# AI-Based Farmer Advisory System

A multilingual AI-powered web application that provides personalized agricultural guidance through conversational AI, crop recommendations, fertilizer advice, weather insights, plant disease detection, and voice interaction.

## Features

- **AI Farmer Advisor** — Provides personalized farming assistance using farmer profile, location, weather, and conversation context.
- **Multilingual Support** — Supports English, Kannada, Hindi, and Tamil.
- **Voice Interaction** — Supports speech input and multilingual text-to-speech output.
- **Crop Recommendations** — Suggests suitable crops based on location and current weather conditions.
- **Fertilizer Advice** — Provides simple, crop-specific fertilizer guidance.
- **Plant Disease Detection** — Uses CNN-based image classification with confidence scores and AI-generated treatment advice.
- **Weather Integration** — Uses location-based weather information for personalized recommendations.
- **Farmer Authentication** — Supports registration, login, generated Farmer IDs, and personalized farmer profiles.

## Tech Stack

### Frontend

React.js, JavaScript, CSS, Vite, React Markdown

### Backend

Python, FastAPI, REST APIs, MongoDB

### AI and Machine Learning

TensorFlow/Keras, scikit-learn, CNN-based image classification, Groq LLM API, gTTS

### Tools

Git, GitHub, VS Code

## Project Structure

```text
AI-Based-Farmer-Advisory-System/
│
├── backend/
│   ├── app/
│   │   ├── config/
│   │   ├── database/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── services/
│   │
│   └── ml/
│       ├── models/
│       ├── notebooks/
│       ├── labels.json
│       ├── predict.py
│       ├── train.py
│       └── requirements.txt
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── i18n/
│       ├── pages/
│       └── services/
│
├── docs/
├── docker/
├── requirements.txt
└── README.md
```
