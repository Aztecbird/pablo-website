# Torso S4 MIDI Controller — Version Catalog & Release History

Author & Creator: Pablo Arellano  
Website: https://www.pabloarellano.org  
Repository: https://github.com/Aztecbird/pablo-website  
Contact: aztecbird@mac.com  

---

## [v1.0.0] - 2026-09-10 (Initial Production Release)
**Status: Production Live**

### Core Control Engine:
- **4-Track Tactile Mixer Layout:** Direct channel-strip mirroring of Torso S4 architecture across MIDI Channels 1–4.
  - **Material Volume:** High-resolution vertical fader assigned to CC 56.
  - **Resonant Filter Cutoff:** Large central rotary dial mapped to CC 78.
  - **Auxiliary Sends 1–4:** Dedicated dials assigned to CC 10, 11, 12, and 13.
  - **Context Encoders 1–5:** 5 multi-purpose dials mapping directly to S4 parameter encoders (CC 14, 15, 16, 17, 18).
- **Dual Hardware Command Integration:**
  - Simultaneous MIDI output routing for **Torso Electronics S4** and **Hologram Microcosm** pedal.

### Performance & Automation Features:
- **Live Automation Loop Recorder:**
  - Record continuous knob & fader gestures in real-time.
  - Loop lengths: 4, 8, 16, 32, 64, or 128 bars.
  - Global tempo control (40–240 BPM) with animated playhead timeline.
- **Preset Management System:**
  - Instant browser-based preset saving and recall.
  - JSON import/export functionality for backing up performance states or sharing parameter presets across machines.
- **Panic Protection:**
  - Global emergency silence button resetting active CCs and clearing stuck notes across all channels.

### Standalone Packaging:
- Double-clickable standalone macOS app bundle (`Torso S4 Controller.app`).
- Zero-terminal `start.command` one-click browser launcher.
- Clean distribution package: `Torso-S4-Controller-v1.0-Mac.zip`.

---

## [Roadmap & Planned Next Versions]

### [v1.1.0] (Upcoming):
- MIDI Clock synchronization directly receiving DAW transport start/stop and clock pulses.
- Granular Mosaic parameter macro switches (instant grain freeze and spray spread).
- S4 Looper track dedicated controls (tape reverse, half-speed, and overdub levels).

### [v1.2.0] (Planned):
- MIDI LFO generator sending multi-wave modulation to any S4 encoder destination.
- Audio-reactive parameter modulation from live microphone or interface input.
