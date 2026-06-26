// ─── State ────────────────────────────────────────────────────────────────────
let userEmail = "";
let currentTranslation = "";
let isSpeaking = false;

// ─── DOM References ───────────────────────────────────────────────────────────
const sourceLangEl    = document.getElementById("sourceLang");
const targetLangEl    = document.getElementById("targetLang");
const sourceTextEl    = document.getElementById("sourceText");
const translationOut  = document.getElementById("translationOutput");
const charCountEl     = document.getElementById("charCount");
const translateBtn    = document.getElementById("translateBtn");
const btnText         = translateBtn.querySelector(".btn-text");
const btnLoader       = document.getElementById("btnLoader");
const swapBtn         = document.getElementById("swapBtn");
const clearBtn        = document.getElementById("clearBtn");
const copyBtn         = document.getElementById("copyBtn");
const copyFeedback    = document.getElementById("copyFeedback");
const speakSource     = document.getElementById("speakSource");
const speakTarget     = document.getElementById("speakTarget");
const errorBar        = document.getElementById("errorBar");
const errorMsg        = document.getElementById("errorMsg");
const modalOverlay    = document.getElementById("modalOverlay");
const apiKeyInput     = document.getElementById("apiKeyInput");
const saveApiKey      = document.getElementById("saveApiKey");

// ─── Init ─────────────────────────────────────────────────────────────────────
function init() {
  populateLanguageSelects();
  showModal();
  bindEvents();
}

// ─── Language Dropdowns ───────────────────────────────────────────────────────
function populateLanguageSelects() {
  LANGUAGES.forEach(lang => {
    const optSource = new Option(lang.name, lang.code);
    const optTarget = new Option(lang.name, lang.code);
    sourceLangEl.add(optSource);
    if (lang.code !== "auto") targetLangEl.add(optTarget);
  });

  // Default: Auto → Spanish
  sourceLangEl.value = "auto";
  targetLangEl.value = "es";
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function showModal() {
  const saved = localStorage.getItem("lf_email") || "";
  apiKeyInput.value = saved;
  modalOverlay.classList.remove("hidden");
}

saveApiKey.addEventListener("click", () => {
  userEmail = apiKeyInput.value.trim();
  if (userEmail) localStorage.setItem("lf_email", userEmail);
  modalOverlay.classList.add("hidden");
});

// Allow pressing Enter in modal
apiKeyInput.addEventListener("keydown", e => {
  if (e.key === "Enter") saveApiKey.click();
});

// ─── Events ───────────────────────────────────────────────────────────────────
function bindEvents() {
  sourceTextEl.addEventListener("input", handleInput);
  translateBtn.addEventListener("click", handleTranslate);
  swapBtn.addEventListener("click", handleSwap);
  clearBtn.addEventListener("click", handleClear);
  copyBtn.addEventListener("click", handleCopy);
  speakSource.addEventListener("click", () => speakText(sourceTextEl.value, sourceLangEl.value, speakSource));
  speakTarget.addEventListener("click", () => speakText(currentTranslation, targetLangEl.value, speakTarget));

  // Translate on Ctrl+Enter
  sourceTextEl.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleTranslate();
  });
}

function handleInput() {
  const len = sourceTextEl.value.length;
  charCountEl.textContent = len;

  const wrap = charCountEl.parentElement;
  wrap.classList.toggle("warn", len > 4000);
  wrap.classList.toggle("over", len > 5000);
}

function handleSwap() {
  const srcCode = sourceLangEl.value;
  const tgtCode = targetLangEl.value;

  // Swap languages (if source is "auto", just flip translation)
  if (srcCode !== "auto") {
    sourceLangEl.value = tgtCode;
    // Try to set target to src
    const opt = [...targetLangEl.options].find(o => o.value === srcCode);
    if (opt) targetLangEl.value = srcCode;
  }

  // Swap text if there's a translation
  if (currentTranslation) {
    sourceTextEl.value = currentTranslation;
    handleInput();
    setOutput(sourceTextEl.value);
    currentTranslation = sourceTextEl.value;
  }
}

function handleClear() {
  sourceTextEl.value = "";
  handleInput();
  currentTranslation = "";
  translationOut.innerHTML = '<span class="placeholder-text">Your translation will appear here</span>';
  translationOut.classList.remove("has-text", "loading");
  hideError();
}

async function handleCopy() {
  if (!currentTranslation) return;
  try {
    await navigator.clipboard.writeText(currentTranslation);
    copyFeedback.textContent = "✓ Copied!";
    copyFeedback.classList.add("show");
    setTimeout(() => copyFeedback.classList.remove("show"), 2000);
  } catch {
    copyFeedback.textContent = "Copy failed";
    copyFeedback.classList.add("show");
    setTimeout(() => copyFeedback.classList.remove("show"), 2000);
  }
}

// ─── Translation API ──────────────────────────────────────────────────────────
async function handleTranslate() {
  const text = sourceTextEl.value.trim();
  if (!text) {
    showError("Please enter some text to translate.");
    return;
  }

  const srcLang = sourceLangEl.value;
  const tgtLang = targetLangEl.value;

  if (srcLang === tgtLang) {
    showError("Source and target languages are the same.");
    return;
  }

  setLoading(true);
  hideError();

  try {
    const result = await translateText(text, srcLang, tgtLang);
    currentTranslation = result;
    setOutput(result);
  } catch (err) {
    showError(err.message || "Translation failed. Please try again.");
  } finally {
    setLoading(false);
  }
}

async function translateText(text, srcLang, tgtLang) {
  // MyMemory free API — no key needed, email for higher quota
  const langPair = srcLang === "auto"
    ? `|${tgtLang}`
    : `${srcLang}|${tgtLang}`;

  let url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langPair)}`;
  if (userEmail) url += `&de=${encodeURIComponent(userEmail)}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Network error: ${response.status}`);

  const data = await response.json();

  if (data.responseStatus === 403) {
    throw new Error("Daily translation limit reached. Add your email in setup for more capacity.");
  }

  if (data.responseStatus !== 200) {
    throw new Error(data.responseDetails || "Translation service returned an error.");
  }

  const translated = data.responseData?.translatedText;
  if (!translated) throw new Error("No translation returned.");

  return translated;
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────
function setLoading(on) {
  translateBtn.disabled = on;
  btnText.hidden = on;
  btnLoader.hidden = !on;

  if (on) {
    translationOut.innerHTML = `
      <span class="loading">
        <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        Translating…
      </span>`;
    translationOut.classList.add("loading");
    translationOut.classList.remove("has-text");
  }
}

function setOutput(text) {
  translationOut.textContent = text;
  translationOut.classList.remove("loading");
  translationOut.classList.add("has-text");
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorBar.hidden = false;
}

function hideError() {
  errorBar.hidden = true;
}

// ─── Text-to-Speech ───────────────────────────────────────────────────────────
function speakText(text, langCode, btn) {
  if (!text) return;

  // If already speaking, stop
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    document.querySelectorAll(".speak-btn").forEach(b => b.classList.remove("speaking"));
    return;
  }

  const utter = new SpeechSynthesisUtterance(text);

  // Map language codes to BCP-47 (most already match)
  const langMap = {
    "zh-CN": "zh-CN", "zh-TW": "zh-TW",
    "auto": "en-US"
  };
  utter.lang = langMap[langCode] || langCode;

  utter.onstart = () => btn.classList.add("speaking");
  utter.onend   = () => btn.classList.remove("speaking");
  utter.onerror = () => btn.classList.remove("speaking");

  window.speechSynthesis.speak(utter);
}

// ─── Start ────────────────────────────────────────────────────────────────────
init();
