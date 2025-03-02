export function playUISound(soundFile = "/sounds/click.mp3", volume = 0.5) {
  if (typeof window !== "undefined") {
    let sound = new Audio(soundFile);
    sound.volume = volume;
    sound.play().catch((e) => console.warn("🔇 Audio playback failed:", e));
  }
}

// ✅ 🔥 PATOBULINTA: Garso "pool" mechanizmas greitesniam atkūrimui
const soundPool = {
  click: new Audio("/sounds/click.mp3"),
  hover: new Audio("/sounds/hover.mp3"),
  success: new Audio("/sounds/success.mp3"),
  error: new Audio("/sounds/error.mp3"),
  notification: new Audio("/sounds/notification.mp3"), // ✅ Naujas garsas pranešimams
  login: new Audio("/sounds/login.mp3"), // ✅ Naujas garsas prisijungimui
};

function playFromPool(type = "click", volume = 0.5) {
  if (typeof window !== "undefined" && soundPool[type]) {
    soundPool[type].volume = volume;
    soundPool[type].currentTime = 0;
    soundPool[type].play().catch((e) => console.warn("🔇 Audio playback failed:", e));
  }
}

// ✅ **Automatinis garsų pritaikymas UI mygtukams**
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".button, .navbar a").forEach((el) => {
      el.addEventListener("click", () => playFromPool("click"));
    });

    document.querySelectorAll(".button, .navbar a").forEach((el) => {
      el.addEventListener("mouseenter", () => playFromPool("hover", 0.3));
    });

    document.querySelectorAll(".success-action").forEach((el) => {
      el.addEventListener("click", () => playFromPool("success", 0.7));
    });

    document.querySelectorAll(".error-action").forEach((el) => {
      el.addEventListener("click", () => playFromPool("error", 0.7));
    });

    document.querySelectorAll(".notification").forEach((el) => {
      el.addEventListener("click", () => playFromPool("notification", 0.6));
    });

    document.querySelectorAll(".login-action").forEach((el) => {
      el.addEventListener("click", () => playFromPool("login", 0.8));
    });
  });
}

// ✅ **🔇 UI valdomas garsų išjungimas**
export function toggleUISounds(mute = false) {
  for (let sound in soundPool) {
    soundPool[sound].muted = mute;
  }
  console.log(`🔊 UI sounds ${mute ? "muted" : "enabled"}`);
}
