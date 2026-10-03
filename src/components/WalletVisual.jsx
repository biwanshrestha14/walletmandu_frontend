import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const fallbackImages = [
  'wallet.png',
  'wallet4.png',
  'wallet2.png',
  'wallet3.png',
  'wallet1.png',
].map((filename) => `${import.meta.env.BASE_URL}${filename}`);

export default function WalletVisual({
  product,
  hero = false,
  featuredProducts = [],
  carousel = true,
}) {
  const productImages = [...(product?.images || [])]
    .sort((first, second) => first.position - second.position)
    .map((image) => image.url);
  const imageSources = [product?.coverImageUrl, ...productImages].filter(
    Boolean,
  );
  const images =
    hero && featuredProducts.length
      ? featuredProducts.map((item) => item.coverImageUrl)
      : !imageSources.length
        ? fallbackImages
        : [...new Set(imageSources)].slice(0, 3);

  return (
    <WalletGallery
      key={images.join('|')}
      images={images}
      imageNames={hero ? featuredProducts.map((item) => item.name) : []}
      name={product?.name || 'WalletMandu wallet'}
      tone={product?.tone || 'cognac'}
      hero={hero}
      carousel={carousel}
    />
  );
}

function WalletGallery({ images, imageNames, name, tone, hero, carousel }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPageHidden, setIsPageHidden] = useState(document.hidden);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const touchStartX = useRef(null);
  const hasControls = carousel && images.length > 1;
  const isAutoPlaying =
    hasControls &&
    !isHovered &&
    !hasFocus &&
    !isTouching &&
    !isPaused &&
    !isPageHidden &&
    !prefersReducedMotion;

  useEffect(() => {
    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    const updateMotionPreference = () =>
      setPrefersReducedMotion(motionPreference.matches);
    const updateVisibility = () => setIsPageHidden(document.hidden);

    motionPreference.addEventListener('change', updateMotionPreference);
    document.addEventListener('visibilitychange', updateVisibility);

    return () => {
      motionPreference.removeEventListener('change', updateMotionPreference);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timeout = window.setTimeout(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % images.length);
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, images.length, isAutoPlaying]);

  function showPreviousImage() {
    setActiveIndex(
      (currentIndex) => (currentIndex - 1 + images.length) % images.length,
    );
  }

  function showNextImage() {
    setActiveIndex((currentIndex) => (currentIndex + 1) % images.length);
  }

  function handleKeyDown(event) {
    if (!hasControls) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPreviousImage();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNextImage();
    }
  }

  function handleTouchEnd(event) {
    setIsTouching(false);
    if (!hasControls || touchStartX.current === null) return;

    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (distance > 40) showPreviousImage();
    if (distance < -40) showNextImage();
  }

  return (
    <div
      className={`wallet-scene wallet-gallery ${hero ? 'hero-scene' : ''} ${hasControls ? 'has-carousel' : ''} tone-${tone}`}
      role={hasControls ? 'group' : undefined}
      aria-roledescription={hasControls ? 'carousel' : undefined}
      aria-label={hasControls ? `${name} images` : undefined}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setHasFocus(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setHasFocus(false);
        }
      }}
      onTouchStart={(event) => {
        setIsTouching(true);
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        setIsTouching(false);
        touchStartX.current = null;
      }}
    >
      <div className="scene-circle" />

      <div className="wallet-photo-stage">
        {images.map((image, index) => (
          <div
            key={image}
            className={`wallet-slide ${index === activeIndex ? 'is-active' : ''}`}
            aria-hidden={index !== activeIndex}
          >
            {failedImages.includes(image) ? (
              <span className="muted">Image unavailable</span>
            ) : (
              <img
                className="wallet-gallery-image"
                src={image}
                alt={`${imageNames[index] || name} — view ${index + 1}`}
                loading={hero ? 'eager' : 'lazy'}
                draggable={false}
                onError={() => {
                  setFailedImages((previous) => [...previous, image]);
                }}
              />
            )}
          </div>
        ))}
      </div>

      {hero && (
        <>
          <span className="scene-caption">THE EVERYDAY COLLECTION</span>
          <span className="scene-number">
            {String(activeIndex + 1).padStart(2, '0')} /{' '}
            {String(images.length).padStart(2, '0')}
          </span>
        </>
      )}

      {hasControls && (
        <div className="wallet-carousel-controls">
          <button
            type="button"
            className="wallet-carousel-arrow"
            aria-label="Previous wallet image"
            onClick={showPreviousImage}
          >
            <ChevronLeft size={18} />
          </button>

          <div className="wallet-carousel-dots">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                className="wallet-carousel-dot"
                aria-label={`Show wallet image ${index + 1}`}
                aria-pressed={activeIndex === index}
                onClick={() => setActiveIndex(index)}
              >
                <span />
              </button>
            ))}
          </div>

          <button
            type="button"
            className="wallet-carousel-arrow"
            aria-label="Next wallet image"
            onClick={showNextImage}
          >
            <ChevronRight size={18} />
          </button>

          {!prefersReducedMotion && (
            <button
              type="button"
              className="wallet-carousel-playback"
              aria-label={
                isPaused ? 'Play wallet slideshow' : 'Pause wallet slideshow'
              }
              onClick={() => setIsPaused((wasPaused) => !wasPaused)}
            >
              {isPaused ? <Play size={13} /> : <Pause size={13} />}
            </button>
          )}

          <span
            className="sr-only"
            aria-live={isAutoPlaying ? 'off' : 'polite'}
            aria-atomic="true"
          >
            Image {activeIndex + 1} of {images.length}
          </span>
        </div>
      )}
    </div>
  );
}
