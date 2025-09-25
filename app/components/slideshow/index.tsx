'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import styles from './slideshow.module.css'

interface SlideshowProps {
  images: string[]
  alt?: string
  autoplay?: boolean
  interval?: number
  height?: number
}

const Slideshow = ({
  images,
  alt = 'Slideshow image',
  autoplay = true,
  interval = 5000,
  height = 400,
}: SlideshowProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    )
  }, [images.length])

  const previousImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    )
  }, [images.length])

  const toggleFullscreen = (e: React.MouseEvent) => {
    // Prevent toggling fullscreen when clicking navigation buttons
    if (
      (e.target as HTMLElement).closest(`.${styles.navButton}`) ||
      (e.target as HTMLElement).closest(`.${styles.dotsContainer}`)
    ) {
      return
    }
    setIsFullscreen(!isFullscreen)
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'Escape') {
          setIsFullscreen(false)
        } else if (e.key === 'ArrowRight') {
          nextImage()
        } else if (e.key === 'ArrowLeft') {
          previousImage()
        }
      }
    },
    [isFullscreen, nextImage, previousImage],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  useEffect(() => {
    // Disable autoplay in fullscreen mode to give user control
    if (isFullscreen || !autoplay) return

    const interval_id = setInterval(() => {
      nextImage()
    }, interval)

    return () => clearInterval(interval_id)
  }, [autoplay, interval, isFullscreen, nextImage])

  // Prevent body scrolling when in fullscreen mode
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  if (!images || images.length === 0) {
    return <div className={styles.noImages}>No images to display</div>
  }

  return (
    <>
      <div className={styles.slideshowContainer} onClick={toggleFullscreen}>
        <div className={styles.slideshow} style={{ height: `${height}px` }}>
          {images.map((image, index) => (
            <div
              key={index}
              className={`${styles.slide} ${index === currentImageIndex ? styles.active : ''}`}
            >
              <Image
                src={image}
                alt={`${alt} ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                style={{ objectFit: 'contain' }}
                priority={index === 0}
              />
            </div>
          ))}

          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={(e) => {
              e.stopPropagation()
              previousImage()
            }}
            aria-label="Previous image"
          >
            &#10094;
          </button>

          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            aria-label="Next image"
          >
            &#10095;
          </button>

          <button
            className={styles.expandButton}
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'View fullscreen'}
          >
            {isFullscreen ? '⟨⟩' : '⟫⟪'}
          </button>
        </div>

        <div
          className={styles.dotsContainer}
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${index === currentImageIndex ? styles.activeDot : ''}`}
              onClick={() => setCurrentImageIndex(index)}
              role="button"
              tabIndex={0}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div className={styles.fullscreenOverlay} onClick={toggleFullscreen}>
          <div
            className={styles.fullscreenContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.fullscreenImageContainer}>
              {images.map((image, index) => (
                <div
                  key={`fullscreen-${index}`}
                  className={`${styles.fullscreenSlide} ${index === currentImageIndex ? styles.active : ''}`}
                >
                  <Image
                    src={image}
                    alt={`${alt} ${index + 1}`}
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
              ))}
            </div>

            <button
              className={`${styles.navButton} ${styles.fullscreenPrevButton}`}
              onClick={previousImage}
              aria-label="Previous image"
            >
              &#10094;
            </button>

            <button
              className={`${styles.navButton} ${styles.fullscreenNextButton}`}
              onClick={nextImage}
              aria-label="Next image"
            >
              &#10095;
            </button>

            <button
              className={styles.closeButton}
              onClick={toggleFullscreen}
              aria-label="Close fullscreen view"
            >
              &times;
            </button>

            <div className={styles.imageCounter}>
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Slideshow
