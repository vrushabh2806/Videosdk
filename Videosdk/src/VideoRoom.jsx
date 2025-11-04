import React, { useEffect, useRef } from 'react'

export default function VideoRoom({ title, stream, relayedStream }) {
  const videoRef = useRef(null)
  const relayRef = useRef(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (stream) {
      v.srcObject = stream
      v.play().catch(() => {})
    } else {
      v.srcObject = null
    }
  }, [stream])

  useEffect(() => {
    const vr = relayRef.current
    if (!vr) return
    if (relayedStream) {
      vr.srcObject = relayedStream
      vr.play().catch(() => {})
    } else {
      vr.srcObject = null
    }
  }, [relayedStream])

  return (
    <div style={{ border: '1px solid #ccc', padding: 12, borderRadius: 8, width: 360 }}>
      <h3>{title}</h3>
      <video ref={videoRef} style={{ width: '100%', background: '#000' }} playsInline muted />
      <div style={{ marginTop: 8 }}>
        <small>Relayed preview (if media relay active):</small>
        <video ref={relayRef} style={{ width: '100%', marginTop: 6, background: '#000' }} playsInline muted />
      </div>
    </div>
  )
}
