import React, { useState, useRef } from 'react'
import VideoRoom from './VideoRoom'
import { getLocalMedia, stopStream } from './videoService'

export default function App() {
  const [localStream, setLocalStream] = useState(null)
  const [currentRoom, setCurrentRoom] = useState(null) // 'A' or 'B'
  const [relayStream, setRelayStream] = useState(null)
  const originalStreamRef = useRef(null)

  async function joinRoomA() {
    try {
      const stream = await getLocalMedia()
      originalStreamRef.current = stream
      setLocalStream(stream)
      setCurrentRoom('A')
    } catch (e) {
      console.error('Could not get local media', e)
      alert('Unable to access camera/microphone: ' + e.message)
    }
  }

  function switchToRoomB() {
    // Seamless switch: keep the same MediaStream and attach to Room B
    if (!originalStreamRef.current) {
      alert('Not in a room yet. Click "Join Room A" first.')
      return
    }
    setLocalStream(originalStreamRef.current)
    setCurrentRoom('B')
  }

  function switchBackToRoomA() {
    if (!originalStreamRef.current) return
    setLocalStream(originalStreamRef.current)
    setCurrentRoom('A')
  }

  function stopAll() {
    stopStream(originalStreamRef.current)
    originalStreamRef.current = null
    setLocalStream(null)
    setRelayStream(null)
    setCurrentRoom(null)
  }

  function startMediaRelay() {
    // Simulated media relay: clone tracks and send to other room's preview.
    if (!originalStreamRef.current) {
      alert('Start and join Room A first')
      return
    }
    // Clone creates new MediaStream with same tracks; original tracks continue
    const cloned = originalStreamRef.current.clone()
    setRelayStream(cloned)
  }

  return (
    <div style={{ fontFamily: 'Segoe UI, Roboto, sans-serif', padding: 24 }}>
      <h1>VideoSDK Room Switch Demo (simulated)</h1>

      <div style={{ marginBottom: 12 }}>
        <button onClick={joinRoomA} style={{ marginRight: 8 }}>Join Room A</button>
        <button onClick={switchToRoomB} style={{ marginRight: 8 }}>Switch to Room B</button>
        <button onClick={switchBackToRoomA} style={{ marginRight: 8 }}>Switch to Room A</button>
        <button onClick={startMediaRelay} style={{ marginRight: 8 }}>Start Media Relay (simulated)</button>
        <button onClick={stopAll} style={{ marginLeft: 12, color: '#900' }}>Leave / Stop</button>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <VideoRoom title={`Room A ${currentRoom === 'A' ? '(active)' : ''}`} stream={currentRoom === 'A' ? localStream : null} relayedStream={relayStream} />
        <VideoRoom title={`Room B ${currentRoom === 'B' ? '(active)' : ''}`} stream={currentRoom === 'B' ? localStream : null} relayedStream={relayStream} />
      </div>

      <section style={{ marginTop: 20 }}>
        <h2>Notes</h2>
        <ul>
          <li>This demo uses the browser MediaStream API to simulate joining and switching rooms without reloading.</li>
          <li>"Seamless" switching here moves the same MediaStream to the other room's container, preserving tracks.
          Real VideoSDK integration will use SDK methods to re-attach tracks or re-publish without a full reconnect when supported.</li>
          <li>"Media Relay (simulated)" clones your outgoing tracks and shows them as a relayed preview in both rooms. Real media relay typically forwards media server-side between rooms.</li>
        </ul>
      </section>
    </div>
  )
}
