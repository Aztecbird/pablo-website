# Microcosm AI — Version Catalog & Release History

Author & Creator: Pablo Arellano
Website: https://www.pabloarellano.org
Repository: https://github.com/Aztecbird/pablo-website

---

## [v1.0.0] - 2026-09-10 (Initial Release)
**Status: Production Live**
- **CoreMIDI Bridge:** Low-latency native C/CoreMIDI daemon (`midi_bridge`) with rate-limiting and bi-directional communication.
- **Hardware Integration:**
  - Automatic detection of Behringer UMC1820 interface (DIN MIDI OUT) and Casio USB-MIDI / Hydrasynth keyboards.
  - Signal routing preset confirmed for Logic Pro (Piano send Out 3/4 -> Microcosm In -> UMC1820 Return In 1/2).
- **Adaptive Performance Engine:**
  - **Follow Mode:** Dynamically tracks note strike velocity and density ($notes/second$). Quiet playing expands Space (Reverb CC 29); busy chords back off Mix (CC 28) to preserve clarity.
  - **Evolve Mode:** Timed parameter sweeps (e.g. slow Filter CC 30 darkening over 60 seconds).
  - **Combine Mode:** Blends live playing responsiveness with macro background sweeps.
- **Pedal Protection:**
  - 25ms smoothing loop to eliminate audible CC stepping and zipper noise.
  - **Pause Automation:** Instant state freeze.
  - **Snapshot Restore:** One-click baseline reset.
- **UI & Distribution:**
  - Glassmorphic companion UI running on `localhost:3880`.
  - Built-in prompt interpreter with 4 quick presets: *Spacious Ambient*, *Gentle Clarity*, *Slow Darken*, *Complete Trio*.
  - Live Audio Analysis meter with Web Audio API.
  - Standalone macOS app bundle (`Microcosm AI.app`) and 1-click launcher (`start.command`).
  - Distribution package: `Microcosm-AI-v1.0-Mac.zip`.

---

## [Roadmap & Planned Next Versions]
- **[v1.1.0] (Upcoming):**
  - Save / Export custom user presets to disk.
  - Additional Microcosm CC controls: Activity (CC 25), Repeats (CC 26), and Time (CC 27).
  - Looper & Hold sampler auto-triggers (CC 17 / CC 102).
- **[v1.2.0] (Planned):**
  - Standalone AU / VST3 plugin wrapper or Logic Pro Scripter extension.

## [v1.1.0] - 2026-09-13 (Expanded Algorithm & 6-Parameter Suite)
**Status: Production Live**
- **Algorithm Engine Selection (via MIDI Program Change):**
  - **WARP** (Glitch, Program 0)
  - **INTERRUPT** (Glitch Stutter, Program 1)
  - **TUNNEL** (Granular Ambient Wash, Program 4)
  - **MAZE** (Rhythmic Multi-Tap Delay, Program 8)
  - **MOSAIC** (Granular, Program 12)
  - **HAZE** (Granular, Program 16)
- **Expanded 6-Parameter Dynamic Control:**
  - **Activity (CC 25):** Granular density and burst generation.
  - **Repeats (CC 26):** Decay length and buffer memory.
  - **Time / Tap (CC 27):** Tempo subdivision and clock sync.
  - **Mix (CC 28)**, **Space (CC 29)**, and **Filter (CC 30)**.
- **Enhanced Prompt Interpreter:**
  - Algorithm-aware parsing: automatically tunes ranges for Warp, Interrupt, Tunnel, and Maze based on text prompts.

## [v1.2.0] - 2026-09-13 (C4 Register Split: Dramatic Bass vs Bright Treble)
**Status: Production Live**
- **Dynamic Keyboard Split (Pivoting at Middle C / C4 = Note 60):**
  - **Descending below C4 (Bass / Dramatic):** The deeper you play into the lower registers, the pedal automatically drives the **Filter (CC 30)** down into warm, dark resonance (down to 25–45), lengthens **Repeats (CC 26)** to create a looming, cavernous decay, and deepens **Space (CC 29)**.
  - **Ascending above C4 (Treble / Bright & Cheerful):** Climbing into the higher octaves smoothly opens the **Filter** up to 80–120 (sparkling high-pass/open cutoff), triggers airy shimmer **Space**, and generates delicate fluttering **Activity (CC 25)** grains.
- **HUD Register Feedback:** The telemetry display now indicates note name and active register mode: `C3 (#48) [Bass / Dramatic]` vs `E5 (#76) [Treble / Bright]`.
- **Velocity Layering:** Touch velocity continues to modulate dynamics (soft touches expand wash, aggressive hits tighten the mix) in tandem with pitch tracking.
