# 🌐 LinguaFlow — Language Translator

A sleek, fully functional language translation web app built with vanilla HTML, CSS, and JavaScript.
Uses the **MyMemory Translation API** — free, no sign-up required.

---

## ✨ Features

- 🌍 Translate between **100+ languages**
- 🔄 Swap source & target languages in one click
- 🔊 **Text-to-Speech** for both source and translated text
- 📋 **Copy to clipboard** button for translations
- ⌨️ Character counter (up to 5,000 chars)
- 🎨 Beautiful dark UI with smooth animations
- 📱 Fully responsive (mobile-friendly)
- ⚡ Auto-detect source language supported
- `Ctrl + Enter` keyboard shortcut to translate

---

## 🚀 How to Run in VS Code

### Option 1 — Live Server Extension (Recommended)

1. Open VS Code
2. Install the **Live Server** extension:
   - Press `Ctrl + Shift + X` (Extensions panel)
   - Search for `Live Server` by Ritwick Dey
   - Click **Install**
3. Open the project folder:
   - `File → Open Folder` → select `language-translator`
4. Right-click `index.html` in the Explorer panel
5. Click **"Open with Live Server"**
6. Browser opens at `http://127.0.0.1:5500` ✅

### Option 2 — VS Code Built-in Simple Browser

1. Open `index.html` in VS Code
2. Press `Ctrl + Shift + P`
3. Type `Simple Browser: Show` and press Enter
4. Enter `file:///path/to/language-translator/index.html`

### Option 3 — Python HTTP Server (no extensions needed)

```bash
cd language-translator
python -m http.server 8080
```
Then open `http://localhost:8080` in your browser.

---

## 📁 Project Structure

```
language-translator/
├── index.html          # Main HTML (UI structure)
├── css/
│   └── style.css       # All styles & design tokens
├── js/
│   ├── languages.js    # Language list (100+ languages)
│   └── app.js          # Translation logic & interactions
└── README.md           # This file
```

---

## 🔑 API Details

**MyMemory Translation API** — Free, no API key required.

| Plan       | Limit              | How to activate              |
|------------|--------------------|------------------------------|
| Anonymous  | 1,000 words/day    | No setup needed              |
| Free Email | 10,000 words/day   | Enter your email at startup  |

When you open the app, a setup modal will prompt for your email.
This is optional but increases your daily limit 10×.

🔗 API Docs: https://mymemory.translated.net/doc/spec.php

---

## 🛠 Tech Stack

| Layer      | Technology                            |
|------------|---------------------------------------|
| Markup     | HTML5                                 |
| Styling    | CSS3 (Custom Properties, Grid, Flex)  |
| Logic      | Vanilla JavaScript (ES2020)           |
| API        | MyMemory REST API (free, no key)      |
| Fonts      | Google Fonts (Syne + Inter)           |
| TTS        | Web Speech API (browser built-in)     |

---

## 🎯 Keyboard Shortcuts

| Shortcut       | Action             |
|----------------|--------------------|
| `Ctrl + Enter` | Translate text     |
| `Enter`        | Confirm API setup  |

---

## 🌐 Browser Support

Works in all modern browsers: Chrome, Firefox, Edge, Safari.
Text-to-Speech requires Chrome or Edge for best results.

---

## 📝 Notes

- The app stores your email in `localStorage` so you don't need to re-enter it.
- Translation quality comes from MyMemory's community database + Google/Microsoft fallback.
- For production use at scale, consider the [DeepL API](https://www.deepl.com/pro-api) or [Google Cloud Translation API](https://cloud.google.com/translate).
