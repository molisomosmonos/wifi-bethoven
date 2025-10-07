// UI
const btn = document.getElementById('btn');
const alertView = document.getElementById('alert');
const closeBtn = document.getElementById('close');
const alertImg = document.getElementById('alertImg');
const alertFallback = document.getElementById('alertFallback');

const AudioContextX = window.AudioContext || window.webkitAudioContext;
let ctx = null;

// ---------- Motor 8-bit (original, sin copyright) ----------
const SAMPLE_RATE = 44100;

// Onda cuadrada (lead)
function squareWave(freq, durationMs, gain=0.18) {
  const seconds = durationMs/1000;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = freq;
  g.gain.value = 0; // pequeño ataque
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.01);
  g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + seconds - 0.02);
  osc.connect(g); g.connect(ctx.destination);
  return {osc, g, stopAt: ctx.currentTime + seconds};
}

// Ruido para “percusión” simple
function playNoise(durationMs, gain=0.12){
  const seconds = durationMs/1000;
  const buffer = ctx.createBuffer(1, SAMPLE_RATE*seconds, SAMPLE_RATE);
  const data = buffer.getChannelData(0);
  for(let i=0;i<data.length;i++){ data[i] = (Math.random()*2-1) * (1 - i/data.length); } // decay
  const src = ctx.createBufferSource();
  const g = ctx.createGain();
  g.gain.value = gain;
  src.buffer = buffer; src.connect(g); g.connect(ctx.destination);
  src.start(); src.stop(ctx.currentTime + seconds);
}

// Escala de frecuencias para el riff (modo mayor con “swing” cuarteto)
const F = {
  A3:220, B3:247, C4:262, D4:294, E4:330, F4:349, G4:392,
  A4:440, B4:494, C5:523, D5:587, E5:659
};

// Riff original 8-bit (no es ninguna canción existente)
const RIFF = [
  [F.E4, 180],[F.G4, 180],[F.A4, 180],[F.E4, 180],
  [F.G4, 180],[F.A4, 180],[
