"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipForward } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const stations = [
  { name: "Chill Lofi", url: "https://streams.ilovemusic.de/iloveradio17.mp3" },
  { name: "Hip Hop", url: "https://streams.ilovemusic.de/iloveradio3.mp3" },
  { name: "Dance", url: "https://streams.ilovemusic.de/iloveradio2.mp3" },
]

export function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStation, setCurrentStation] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause()
    } else {
      audioRef.current?.play()
    }
    setIsPlaying(!isPlaying)
  }

  const nextStation = () => {
    setCurrentStation((prev) => (prev + 1) % stations.length)
    if (isPlaying) {
      audioRef.current?.load()
      audioRef.current?.play()
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5 // Set a default volume
    }
  }, [])

  return (
    <Card className="w-full bg-white/10 text-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Radio Player</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex flex-col space-y-4">
        <audio ref={audioRef} src={stations[currentStation].url} />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Now Playing:</div>
            <div className="text-xs text-gray-300">{stations[currentStation].name}</div>
          </div>
          <div className="flex space-x-2">
            <Button size="icon" variant="secondary" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="secondary" onClick={nextStation}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

