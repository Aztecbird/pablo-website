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
