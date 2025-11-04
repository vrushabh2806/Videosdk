// Simple media helper used by the demo. This is intentionally small and
// self-contained so it can be swapped for real VideoSDK logic later.

export async function getLocalMedia(constraints = { video: true, audio: true }) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('getUserMedia not supported in this browser')
  }
  const stream = await navigator.mediaDevices.getUserMedia(constraints)
  return stream
}

export function stopStream(stream) {
  if (!stream) return
  stream.getTracks().forEach((t) => t.stop())
}
