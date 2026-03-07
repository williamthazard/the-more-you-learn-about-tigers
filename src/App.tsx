import { useState, useRef, useEffect, useCallback } from 'react'

const GIFS = [
  { file: '0 [SIGNAL].gif', label: 'SIGNAL' },
  { file: '1 [MAINSTREAM].gif', label: 'MAINSTREAM' },
  { file: '2 [RUSSIA].gif', label: 'RUSSIA' },
  { file: '3 [ASK].gif', label: 'ASK' },
  { file: '4 [BOARD].gif', label: 'BOARD' },
  { file: '5 [MEDIA].gif', label: 'MEDIA' },
  { file: '6 [SABOTEUR].gif', label: 'SABOTEUR' },
  { file: '7 [NO CHOICE].gif', label: 'NO CHOICE' },
  { file: '8 [PROBLEM].gif', label: 'PROBLEM' },
  { file: '9 [YEARS].gif', label: 'YEARS' },
  { file: '10 [INFLUENCE].gif', label: 'INFLUENCE' },
  { file: '11 [SAD].gif', label: 'SAD' },
  { file: '12 [ANGRY].gif', label: 'ANGRY' },
  { file: '13 [UTTER].gif', label: 'UTTER' },
  { file: '14 [WALKING].gif', label: 'WALKING' },
]

const AUDIO_FILE = '/assets/0001_gran (1).wav'

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayIndex, setDisplayIndex] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadedCount, setLoadedCount] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const preloadedImages = useRef<HTMLImageElement[]>([])

  // Preload all images
  useEffect(() => {
    let loaded = 0
    preloadedImages.current = GIFS.map((gif) => {
      const img = new Image()
      img.src = `/assets/${gif.file}`
      img.onload = () => {
        loaded++
        setLoadedCount(loaded)
        if (loaded === GIFS.length) {
          setTimeout(() => setIsLoading(false), 500)
        }
      }
      img.onerror = () => {
        loaded++
        setLoadedCount(loaded)
        if (loaded === GIFS.length) {
          setTimeout(() => setIsLoading(false), 500)
        }
      }
      return img
    })
  }, [])

  const navigateTo = useCallback((newIndex: number) => {
    if (isTransitioning || newIndex === currentIndex) return

    setIsTransitioning(true)
    setFadeIn(false)

    // First fade out current image
    setTimeout(() => {
      setDisplayIndex(newIndex)
      setCurrentIndex(newIndex)
      // Trigger fade in after a frame
      requestAnimationFrame(() => {
        setFadeIn(true)
      })
    }, 300)

    // Allow next navigation after full transition
    setTimeout(() => {
      setIsTransitioning(false)
    }, 600)
  }, [currentIndex, isTransitioning])

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? GIFS.length - 1 : currentIndex - 1
    navigateTo(newIndex)
  }, [currentIndex, navigateTo])

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === GIFS.length - 1 ? 0 : currentIndex + 1
    navigateTo(newIndex)
  }, [currentIndex, navigateTo])

  const toggleAudio = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoading) return
      if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      } else if (e.key === ' ') {
        e.preventDefault()
        toggleAudio()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrevious, goToNext, toggleAudio, isLoading])

  const displayGif = GIFS[displayIndex]
  const loadProgress = (loadedCount / GIFS.length) * 100

  // Loading screen
  if (isLoading) {
    return (
      <div className="h-full w-full bg-black flex flex-col items-center justify-center gap-8">
        <h1 className="text-white text-2xl md:text-4xl font-black tracking-[0.2em] uppercase">
          Loading
        </h1>
        <div className="w-64 md:w-96 h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${loadProgress}%` }}
          />
        </div>
        <p className="text-white/60 font-mono text-sm">
          {loadedCount} / {GIFS.length}
        </p>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center overflow-hidden">
      {/* GIF with crossfade */}
      <img
        src={`/assets/${displayGif.file}`}
        alt={displayGif.label}
        title={displayGif.label}
        className="absolute h-full w-auto object-contain transition-opacity duration-300 ease-in-out"
        style={{ opacity: fadeIn ? 1 : 0 }}
      />

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={AUDIO_FILE}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Floating Controls - Bottom Right */}
      <div className="fixed bottom-6 right-6 flex items-center gap-3 bg-black/70 backdrop-blur-sm px-5 py-3 rounded-full border border-white/20">
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          disabled={isTransitioning}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white disabled:opacity-50"
          aria-label="Previous GIF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M15.75 19.5L8.25 12l7.5-7.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* GIF Counter */}
        <div className="text-white/80 text-sm font-mono min-w-[60px] text-center">
          {currentIndex + 1} / {GIFS.length}
        </div>

        {/* Play/Pause Audio Button */}
        <button
          onClick={toggleAudio}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Next Button */}
        <button
          onClick={goToNext}
          disabled={isTransitioning}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white disabled:opacity-50"
          aria-label="Next GIF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M8.25 4.5l7.5 7.5-7.5 7.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default App
