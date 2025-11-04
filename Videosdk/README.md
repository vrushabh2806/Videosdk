# VideoSDK Room Switch Demo (simulated)

This repository contains a small React/Vite demo that shows two rooms (Room A and Room B) and demonstrates two behaviors:

- Seamless room switching: the same MediaStream is moved from Room A to Room B without stopping tracks or reloading the page.
- Simulated Media Relay: outgoing tracks are cloned and presented in the other room's preview to demonstrate how relaying can show the same media in another room.

Important: This demo uses the browser MediaStream APIs directly (getUserMedia and MediaStream.clone()). No official VideoSDK SDK is included here because API keys and account-specific setup are required. The code is intentionally structured so you can swap the simulated logic with real VideoSDK SDK calls.

## Files of interest

- `src/App.jsx` — main UI and the switching/relay demo logic.
- `src/VideoRoom.jsx` — small component that renders a video element for a room and a relayed preview.
- `src/videoService.js` — helper wrapping `getUserMedia` and stopping tracks.

## Setup (Windows PowerShell)

1. Install dependencies:

```powershell
cd "c:\Users\Vrushabh Pawar\Documents\SEM6\Videosdk"
npm install
```

2. Run the dev server:

```powershell
npm run dev
```

3. Open the URL printed by Vite (usually `http://localhost:5173`) in two browser windows to simulate different participants. Use the buttons to join Room A, switch to Room B, and start the simulated media relay.

## How the switching is implemented (contract)

- Inputs: user clicks / UI events (Join, Switch, Relay).
- Outputs: video elements attached to a MediaStream.
- Error modes: user denies camera/mic access, browser doesn't support getUserMedia.

Mechanics:

- On "Join Room A" we call `getUserMedia` and store the returned MediaStream in memory.
- To switch rooms, we do not stop or recreate the tracks. Instead we re-assign the same MediaStream instance to the video element representing the target room. This keeps the tracks active and avoids a full page reload.

## Media Relay explanation (simulated)

- The demo uses `MediaStream.clone()` to create a new MediaStream containing duplicates of the tracks. We then attach the cloned stream to the relayed preview in the other room. This demonstrates how the same audio/video can be presented in two rooms simultaneously.
- Real media relay in production typically happens server-side: a media server (or SDK-managed relay) receives a participant's media in one room and forwards (or republishes) it into another room.

## How to replace simulation with VideoSDK

1. Install the official VideoSDK React/JS SDK from VideoSDK (follow their docs for the package name and version).
2. Replace `src/videoService.js` and the local stream logic in `src/App.jsx` with VideoSDK's connect/join/publish methods:
   - Use the SDK to create or join rooms and obtain a `room` or `session` object.
   - Publish your local audio/video tracks using SDK-provided publish methods.
   - To switch rooms seamlessly, prefer strategies that avoid re-creating the capture tracks (reuse getUserMedia tracks and re-publish them to the new room if the SDK allows). If the SDK provides a dedicated room-switch or bridge API, use that.
   - For server-side Media Relay, consult VideoSDK docs for their relay/forwarding feature; often this requires using a server-side token or control plane API.

Notes: the exact method names and parameters depend on the VideoSDK version and are not hard-coded here.

## Limitations & differences between normal switching and media relay

- Simulated switching here is a UI-level move of a MediaStream between video elements. With a real multi-participant service, switching rooms often requires leaving one room (or unpublishing streams) and joining/publishing to another — which may involve a short interruption depending on the SDK's capabilities.
- Simulated media relay uses cloned tracks inside the browser. Real media relay generally involves server-side forwarding or republishing — this is necessary so other participants in the target room receive the media via the signaling/media servers.

## Next steps (suggested)

- Integrate the official VideoSDK JS/React SDK and replace the simulated functions with actual room join/publish/unpublish methods.
- Implement server-side relay if you need reliable cross-room forwarding.
- Add UI to show participant lists and remote participants.

---

If you'd like, I can now:

1. Integrate the official VideoSDK package (if you provide which VideoSDK package and API keys), or
2. Update this demo to include a mock server-side relay example (using WebRTC peer connections), or
3. Create a GitHub repo and push this scaffold for your review.
