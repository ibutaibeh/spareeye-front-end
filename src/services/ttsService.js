// src/services/ttsService.js
const API_BASE = import.meta.env.VITE_BACK_END_SERVER_URL;

export async function ttsSpeak({ text, voiceId }) {
  const resp = await fetch(`${API_BASE}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voiceId }),
  });
  if (!resp.ok) {
    throw new Error(await resp.text());
  }

  const blob = await resp.blob();
  const url = URL.createObjectURL(blob);

  const audio = new Audio(url);
  audio.onended = () => URL.revokeObjectURL(url);
  await audio.play();
  return audio;
}