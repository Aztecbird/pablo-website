# Hydrasynth Ambient Deck — Version Catalog & Release History

Author & Creator: Pablo Arellano  
Website: https://www.pabloarellano.org  
Repository: https://github.com/Aztecbird/pablo-website  

---

## [v1.0.0] - 2026-09-10 (Initial Production Release)
**Status: Production Live**
- **Hardware Integration:**
  - Direct class-compliant USB-MIDI communication with ASM Hydrasynth (Desktop, Keyboard, Deluxe, Explorer).
  - Program Change transmission to switch hardware sound banks on the fly.
  - Full support for Macro CCs (CC 16–23), Filter Cutoff (CC 74), Resonance (CC 71), Mod Wheel (CC 1), and Expression (CC 11).
- **Curated 20 Ambient Soundscapes Bank:**
  - 20 pre-engineered ambient, granular, and cinematic timbres:
    1. *Nebula Cloud Pad* (Lush interstellar string pad with 14s Cloud reverb)
    2. *Microcosm Mosaic* (Glitchy, sliced harmonic bell textures with random pitch scatter)
    3. *Abyssal Drone* (Deep sub-bass drone with looping envelopes & resonant low-pass)
    4. *Glass Aurora* (Shimmering crystal chime pluck with +12st pitch-shift delay & open air)
    5. *Tape Memory 1984* (Warm vintage drift, analog wow/flutter, and saturated warm filter)
    6. *Solar Wind* (Evolving resonant noise-swept ambient texture with slow wavetable morph)
    7. *Bioluminescence* (Cascading droplet arps with reverse delay swells & stereo pan scatter)
    8. *Ethereal Voices* (Vocal formant morphing through linear FM and cathedral hall reverb)
    9. *Dark Matter Sub* (Ultra-deep cinematic drone with slow breathing LFO pitch & filter warp)
    10. *Celestial Choir* (Ethereal angelic pad with wide stereo chorus and 16-second cloud reverb)
    11. *Shoegaze Horizon* (Dense wall-of-sound ambient wash with heavy drive & reverse reflections)
    12. *Raindrop Granules* (Random micro-plucks scattering across stereo space like rain on glass)
    13. *Submerged Cathedral* (Massive dark church reverb with slow low-pass resonant opening)
    14. *Frozen Shimmer* (Icy overtones, harmonic mutator, and frozen reverb buffer)
    15. *Midnight Tape Reel* (Half-speed style analog tape flutter and mellow nostalgic bells)
    16. *Cosmic Strummer* (Fast one-shot saw sweeps creating harp-like cascading gestures)
    17. *Crystalline Cavern* (Metallic ring-mod bells diffusing into pitch-shifted echo clouds)
    18. *Warm Oberheim Bloom* (Pure vintage analog style drifting lush brass pad with creamy warmth)
    19. *Quantum Haze* (Diffused granular pad that floats behind notes with reverse swell)
    20. *Infinity Space Drone* (Endless evolving ambient wash with infinite reverb freeze & tape wow)
  - 1-click sound morphing and instant parameter recall.
- **Microcosm Algorithmic Fusion:**
  - Integrated sound design emulation of Hologram Microcosm granular modes (Mosaic Glitch, Haze & Tunnel, Crystal Shimmer, Tape Flutter, Infinite Space Freeze).
- **Interactive Performance Controls:**
  - **Live XY Morph Pad:** Real-time dual-axis modulation (X: Filter Cutoff, Y: Space/Reverb).
  - **Ambient Chord Trigger Pads:** Instant chord voicing generator (Cmaj9, Am9, Fmaj7#11, Dm11, G6/9, Bbmaj7, Fm9, C5 Drone).
  - **Latch / Drone Mode:** Hands-free sustained ambient note hold for live parameter sculpting.
  - **Random Mutation Generator:** Algorithmic parameter randomizer with smooth musically constrained boundaries.
- **DAW & System Extensions:**
  - Logic Pro JavaScript MIDI FX Scripter companion plugin (`hydrasynth_logic_scripter.js`).
  - Terminal CLI script (`hydrasynth_cli.py`) for command-line automation.
- **Packaging & Distribution:**
  - Standalone macOS app bundle (`Hydrasynth Ambient Deck.app`) and 1-click launcher (`start.command`).
  - Distribution package: `Hydrasynth-Ambient-v1.0-Mac.zip`.

---

## [Roadmap & Planned Next Versions]
- **[v1.1.0] (Upcoming):**
  - Custom user preset saving / local library export.
  - Direct NRPN deep-parameter engine access (Custom oscillator wave list cycling, mutant modulation depths).
- **[v1.2.0] (Planned):**
  - Audio-reactive envelope follower for live vocal/acoustic instrument input to modulate Hydrasynth filters.
  - Native AU / VST3 standalone wrapper.
