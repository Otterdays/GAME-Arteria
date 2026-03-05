/**
 * Generate minimal WAV sound effects: tink, thump, splash.
 * Run: node scripts/generate-sounds.js
 * Output: assets/sounds/*.wav
 */
const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 22050;
const BITS = 16;

function createWavSamples(durationSec, generator) {
  const numSamples = Math.floor(SAMPLE_RATE * durationSec);
  const data = Buffer.alloc(numSamples * 2); // 16-bit = 2 bytes per sample
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const sample = Math.max(-32768, Math.min(32767, Math.floor(generator(t, numSamples) * 32767)));
    data.writeInt16LE(sample, i * 2);
  }
  return data;
}

function createWavFile(samples) {
  const dataSize = samples.length;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(1, 20);  // PCM
  header.writeUInt16LE(1, 22);  // mono
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  header.writeUInt16LE(2, 32);  // block align
  header.writeUInt16LE(BITS, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, samples]);
}

// Tink: short high-pitched ding (700Hz, 0.05s, quick decay)
const tinkSamples = createWavSamples(0.05, (t, n) => {
  const freq = 700;
  const decay = Math.exp(-t * 30);
  return Math.sin(2 * Math.PI * freq * t) * decay * 0.3;
});

// Thump: low dull hit (120Hz, 0.08s)
const thumpSamples = createWavSamples(0.08, (t, n) => {
  const freq = 120;
  const decay = Math.exp(-t * 25);
  return Math.sin(2 * Math.PI * freq * t) * decay * 0.4;
});

// Splash: pseudo-noise burst + high freq tail (0.1s)
function pseudoNoise(i) {
  return ((i * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff * 2 - 1;
}
const splashSamples = createWavSamples(0.1, (t, n) => {
  const i = Math.floor(t * SAMPLE_RATE);
  const decay = Math.exp(-t * 20);
  const noise = pseudoNoise(i) * decay;
  const tail = Math.sin(2 * Math.PI * 600 * t) * decay * 0.25;
  return (noise + tail) * 0.35;
});

const outDir = path.join(__dirname, '../assets/sounds');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'tink.wav'), createWavFile(tinkSamples));
fs.writeFileSync(path.join(outDir, 'thump.wav'), createWavFile(thumpSamples));
fs.writeFileSync(path.join(outDir, 'splash.wav'), createWavFile(splashSamples));
console.log('Generated tink.wav, thump.wav, splash.wav in assets/sounds/');
