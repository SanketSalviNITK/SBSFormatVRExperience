# SBS-VR: Immersive Educational Experience

A browser-based, stereoscopic educational game powered by **Three.js** and **Mobile Head Tracking**. This experience uses side-by-side (SBS) rendering to simulate a spatial environment, reactive to the user's movement—perfect for lightweight VR viewers like Google Cardboard or as a spatial window on a mobile device.

## 🚀 Features

- **Stereoscopic SBS Rendering**: Custom Three.js implementation using scissor testing to render synchronized left and right eye views.
- **Real-Time Head Tracking**: Leverages the `DeviceOrientation` API to map mobile sensor data (gyroscope/accelerometer) to the 3D camera.
- **Gaze Interaction**: A central reticle system allows users to "select" and learn about 3D objects simply by looking at them.
- **Solar System Module**: A modular 3D environment featuring the Sun, planets with real-time orbits, and interactive data points.
- **Premium Design**: A glassmorphic UI overlay for onboarding, calibration, and HUD, ensuring a modern and polished feel.
- **Graceful Fallback**: Automatically switches to mouse-based rotation if mobile sensors are unavailable.

## 🛠️ Technical Stack

- **Core**: Three.js (WebGL)
- **Frontend**: Vanilla JavaScript (ES6+), CSS3 (Custom Design System)
- **Build Tool**: Vite
- **APIs**: DeviceOrientation, Raycasting for Gaze

## 📂 Architecture

- `src/core/Renderer.js`: Handles the stereoscopic splitting and camera synchronization.
- `src/core/CameraController.js`: Manages sensor input, smoothing (lerp), and calibration.
- `src/modules/SolarSystem.js`: Modular scene construction and animation logic.
- `src/main.js`: Main app lifecycle, UI state management, and interaction engine.

## 🚦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Access on Mobile**:
   - Ensure your mobile device is on the same network as your development machine.
   - Access the `Network` URL provided by Vite (e.g., `http://192.168.x.x:5173`).
   - **Note**: Many browsers require HTTPS for `DeviceOrientation` APIs. For local testing on mobile, you may need a tool like `ngrok` or a local SSL setup.

## 🎮 How to Play

1. **Initialize**: Tap "Initialize Experience" to request sensor permissions.
2. **Calibrate**: Hold your phone in front of you (or in your VR viewer) and tap "Calibrate" to set the center point.
3. **Explore**: Rotate your phone to look around the Solar System.
4. **Discover**: Center the reticle on a planet to reveal its information in the HUD.

## 🧩 Future Enhancements

- **Quiz Module**: Dynamic quizzes triggered by object discovery.
- **Spatial Audio**: Integration of Three.js `PositionalAudio` for immersive soundscapes.
- **WebRTC Sync**: Use a mobile phone as a controller for a desktop display.
