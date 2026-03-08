import { useState, useRef, useEffect, useCallback } from 'react'
import { setupIcons } from './icons'

// Initialize icons
setupIcons()

const R2_BASE_URL = 'https://pub-556801dc822848d9a7640aeecdd4d94b.r2.dev'

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

const AUDIO_FILE = `${R2_BASE_URL}/0001_gran (1).mp3`

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayIndex, setDisplayIndex] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [loadedCount, setLoadedCount] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const preloadedImages = useRef<HTMLImageElement[]>([])

  // Log title and author on mount
  useEffect(() => {
    console.log('the more you learn about tigers the more obvious tigers become and you start to see stripes everywhere')
    console.log('Robert David Carey')
  }, [])

  // Preload all images
  useEffect(() => {
    let loaded = 0
    preloadedImages.current = GIFS.map((gif) => {
      const img = new Image()
      img.src = `${R2_BASE_URL}/${gif.file}`
      img.onload = () => {
        console.log(`Loaded: ${gif.label}`)
        loaded++
        setLoadedCount(loaded)
        if (loaded === GIFS.length) {
          setLoadingComplete(true)
        }
      }
      img.onerror = () => {
        console.error(`Failed to load: ${gif.label}`)
        loaded++
        setLoadedCount(loaded)
        if (loaded === GIFS.length) {
          setLoadingComplete(true)
        }
      }
      return img
    })
  }, [])

  const navigateTo = useCallback((newIndex: number) => {
    if (isTransitioning || newIndex === currentIndex) return

    console.log(GIFS[newIndex].label)
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
        console.log('Audio off')
      } else {
        audioRef.current.play()
        console.log('Audio on')
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
      <div className="h-full w-full bg-black flex flex-col items-center justify-center gap-8 px-6 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-xl md:text-3xl font-normal tracking-wide lowercase" style={{ fontFamily: "'Roboto Mono', monospace" }}>
            the more you learn about tigers the more obvious tigers become and you start to see stripes everywhere
          </h1>
          <p className="text-white/60 text-sm md:text-base" style={{ fontFamily: "'Roboto Mono', monospace" }}>
            Robert David Carey
          </p>
        </div>

        {loadingComplete ? (
          <button
            onClick={() => setIsLoading(false)}
            className="bg-white/10 hover:bg-white/20 border border-white/30 rounded-full text-white text-lg tracking-widest lowercase transition-colors"
            style={{ fontFamily: "'Roboto Mono', monospace", padding: '0.5rem 2rem' }}
          >
            begin
          </button>
        ) : (
          <>
            <div className="w-64 md:w-96 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300 ease-out"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <p className="text-white/60 font-mono text-sm">
              {loadedCount} / {GIFS.length}
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center overflow-hidden">
      {/* GIF with crossfade */}
      <img
        src={`${R2_BASE_URL}/${displayGif.file}`}
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
          <ion-icon name="chevron-back-outline" style={{ fontSize: '20px' }} />
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
          <ion-icon name={isPlaying ? 'pause' : 'play'} style={{ fontSize: '24px' }} />
        </button>

        {/* Next Button */}
        <button
          onClick={goToNext}
          disabled={isTransitioning}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white disabled:opacity-50"
          aria-label="Next GIF"
        >
          <ion-icon name="chevron-forward-outline" style={{ fontSize: '20px' }} />
        </button>
      </div>
    </div>
  )
}

export default App
