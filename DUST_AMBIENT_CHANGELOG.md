# DUST Ambient Deck — Version Catalog & Release History

Author & Creator: Pablo Arellano  
Website: https://www.pabloarellano.org  
Repository: https://github.com/Aztecbird/pablo-website  
Contact: aztecbird@mac.com  

---

## [v1.0.0] - 2026-09-10 (Initial Production Release)
**Status: Production Live**

### Core Engine & Architecture:
- **Unified Dual-Engine Companion:** Seamlessly pairs **Soundmorph DUST** (granular particle synthesizer) and **Arturia Efx FRAGMENTS** (granular delay & multi-effects processor) into a cohesive ambient environment.
- **Standalone macOS Application Bundle:** Self-contained `DUST Ambient Deck.app` with web-based dashboard and double-clickable `start.command` launcher for terminal-free operation on macOS.
- **Web MIDI Output Controller:** Direct browser-based Web MIDI communication supporting virtual IAC Driver buses, hardware interfaces, and direct DAW routing.

### Curated Preset Suite (50 High-Fidelity Audio Unit Presets):
- **30 Soundmorph DUST Presets (`antigrav 1–30.aupreset`):**
  - **`antigrav 1–8` (Cinematic & Textural Suite):** Ethereal Lydian drift, cosmic glass standing waves, hyperbolic particle starfields, and biomechanical granular glitches.
  - **`antigrav 9–19` (C-Minor Relaxing Suite):** Deep C-Drone anchored restorative soundscapes including Zen Meditation, Warm Velvet Pads, Solfeggio Sanctuary, Night Rain & Felt Piano, and Tibetan Crystal Bowls.
  - **`antigrav 20–30` (Aperiodic Anti-Loop Suite):** Prime-ratio incommensurate particle flow equations that prevent ear fatigue and eliminate perceptible loop repetition over long listening sessions.
- **20 Arturia Efx FRAGMENTS Presets (`antigrav fx 1–20.aupreset`):**
  - **`antigrav fx 1–10` (Cloud & Shimmer Spaces):** Lush planet expansions, sacred cathedral blooms, pitch-shifting auroras, and warm oceanic submersions.
  - **`antigrav fx 11–20` (Long Reverb & Time-Stretch):** Infinite particle clouds, extreme time-dilation stretches, mycelium branching diffusions, and vintage tape padding.

### Interactive Performance Features:
- **Live XY Particle Morph Pad:** Real-time dual-axis manipulation over DUST Particle Flow/Speed (CC 1) and Gravitational Pull (CC 11).
- **Live Macro CC Injector:** Instant control over Filter Brightness (CC 74) and Spatial Orbit Panning (CC 16).
- **C-Minor Drone & Chord Latch Pads:** Hands-free sustained chord voicings (C Drone, Cm Root, Cm9 Floating, Csus2 Space, Abmaj7/C, Cm6 Dorian, Bbsus/C) with panic/all-notes-off release.

### DAW & Synthesis Utilities:
- **Logic Pro Scripter Engine (`dust_logic_scripter.js`):** Native JavaScript MIDI FX plugin for Logic Pro X delivering stochastic note spawning, natural velocity humanization, and multi-rate non-repeating LFO CC automation.
- **Python 8-Stem Audio Generator (`dust_gen.py`):** Standalone zero-dependency Python synthesizer rendering coordinated 24-bit 48kHz stereo WAV stem packs tailored for DUST's 8 emitter slots.

---

## [Roadmap & Planned Next Versions]

### [v1.1.0] (Upcoming):
- Custom user preset exporter allowing users to snapshot and save custom DUST/Efx FRAGMENTS state directly from the companion UI.
- Direct preset switching via MIDI Program Change messages.
- Additional microtonal tuning modes (432Hz natural temperament and Just Intonation chord matrices).

### [v1.2.0] (Planned):
- Native AUv3 / VST3 wrapper embedding the companion UI directly inside Logic Pro X and Ableton Live.
- Audio-reactive envelope follower allowing incoming acoustic instruments (e.g. live piano or guitar) to dynamically modulate particle density and reverb tail size.
