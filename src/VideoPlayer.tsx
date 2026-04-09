import { useRef, useEffect } from 'react'
import type { VideoId } from './gameMachine'

const VIDEO_MAP: Record<VideoId, string> = {
  intro: '/videos/intro.mp4',
  run: '/videos/run.mp4',
  leave: '/videos/leave.mp4',
  look: '/videos/look.mp4',
}

interface VideoPlayerProps {
  videoId: VideoId
  loop: boolean
  onEnded: () => void
  playing: boolean
}

export function VideoPlayer({ videoId, loop, onEnded, playing }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.src = VIDEO_MAP[videoId]
    video.loop = loop
    video.load()

    if (playing) {
      video.play().catch(() => {
        // autoplay blocked — user interaction needed
      })
    }
  }, [videoId, loop, playing])

  return (
    <video
      ref={videoRef}
      className="fmv-video"
      playsInline
      onEnded={onEnded}
    />
  )
}
