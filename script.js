const btn = document.getElementById('btn');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close');
const ssidInput = document.getElementById('ssid');
const modalSsid = document.getElementById('modal-ssid');

const AudioContext = window.AudioContext || window.webkitAudioContext;
let ctx = null;

const NOTES = {
  'C4': 262, 'D4': 294, 'E4': 330, 'F4': 349,
  'G4': 392, 'A4': 440, 'B4': 494, 'C5': 523
};

const MELODY = [
  ['E4',300], ['E4',300], ['F4',300], ['G4',300],
  ['G4',300], ['F4',300], ['E4',300], ['D4',300],
  ['C4',300], ['C4',300], ['D4',300], ['E4',300],
  ['E4',450], ['D4',150], ['D4',600]
];

function playTone(freq, durationMs) {
  if (!ctx) ctx = new AudioContext();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'square';
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.002);
  g.gain.setValueAtTime(0.18, ctx.currentTime + durationMs / 1000 - 0.02);
  g.gain.linearRampToValueAtTime(0, ctx.currentTime + durationMs / 1000);
  o.connect(g); g.connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + durationMs / 1000 + 0.02);
}

function playMelody(melody, onfinish) {
  let t = 0;
  for (const [note, dur] of melody) {
    setTimeout(() => {
      const f = NOTES[note] || 440;
      playTone(f, dur);
    }, t);
    t += dur + 25;
  }
  setTimeout(() => { if (onfinish) onfinish(); }, t + 50);
}

function showModal() { modal.classList.remove('hidden'); }
function hideModal() { modal.classList.add('hidden'); }

btn.addEventListener('click', () => {
  btn.disabled = true;
  const ssid = ssidInput.value.trim();
  btn.textContent = 'Reproduciendo…';
  try {
    playMelody(MELODY, () => {
      modalSsid.textContent = ssid ? `SSID ingresado: ${ssid}` : '';
      showModal();
      btn.disabled = false;
      btn.textContent = 'Conectate a Wi-Fi';
    });
  } catch (e) {
    console.error('Error audio:', e);
    btn.disabled = false;
    btn.textContent = 'Conectate a Wi-Fi';
    showModal();
  }
});

closeBtn.addEventListener('click', hideModal);
modal.addEventListener('click', (ev) => { if (ev.target === modal) hideModal(); });
