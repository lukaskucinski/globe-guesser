import { writeFileSync } from "fs";

// Minimal valid MP3 frame: MPEG1 Layer3 128kbps 44100Hz stereo
const header = Buffer.from([0xff, 0xfb, 0x90, 0x04]);
const frameData = Buffer.concat([header, Buffer.alloc(413)]);

// ~8 frames = ~200ms of silence
const frames = Buffer.concat(Array(8).fill(frameData));

for (const name of ["correct", "wrong", "gameover", "victory", "tick"]) {
  writeFileSync(`public/sounds/${name}.mp3`, frames);
  console.log(`Created ${name}.mp3`);
}
