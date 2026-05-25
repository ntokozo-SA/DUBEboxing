import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
import { galleryImages } from '../data/galleryImages';

const galleryLabels = [
  'Boxing ring and training area',
  'Boxing ring corner',
  'Free weights and gym equipment',
  'Cardio equipment area',
  'Spin bikes and rowing machines',
];

const SWIPE_THRESHOLD = 50;

const Gallery = () => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const showPrev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + galleryImages.length) % galleryImages.length
    );
  }, []);

  const showNext = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % galleryImages.length
    );
  }, []);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    // Ignore mostly vertical swipes (page scroll)
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    if (deltaX < -SWIPE_THRESHOLD) showNext();
    else if (deltaX > SWIPE_THRESHOLD) showPrev();
  };

  useEffect(() => {
    if (lightboxIndex === null) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  const openLightbox = (index) => setLightboxIndex(index);

  return (
    <div className="min-h-screen bg-gray-950 pb-6 sm:pb-10">
      {/* Header — compact on mobile */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Gallery
          </h1>
          <p className="mt-2 text-gray-400 text-sm sm:text-lg max-w-md mx-auto px-2">
            Our ring, equipment, and training facilities
          </p>
        </div>
      </div>

      {/* Photos — mobile-first layout */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        {galleryImages.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <p className="text-gray-400 text-base sm:text-lg">No photos yet.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {/* Featured hero — taller on phone, easier to tap */}
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="gallery-tap-target group relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-2xl sm:rounded-xl bg-gray-800 active:opacity-90"
              aria-label={`View ${galleryLabels[0]}`}
            >
              <img
                src={galleryImages[0]}
                alt={galleryLabels[0]}
                className="w-full h-full object-cover"
                decoding="async"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/logo.jpg';
                }}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
              <span className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto text-left">
                <span className="block text-white text-sm sm:text-base font-semibold leading-snug">
                  {galleryLabels[0]}
                </span>
                <span className="mt-1 inline-flex items-center gap-1.5 text-white/80 text-xs sm:text-sm">
                  <FaExpand className="shrink-0" aria-hidden />
                  Tap to view full size
                </span>
              </span>
            </button>

            {/* Thumbnails — single column on small phones, 2 cols from 400px+ */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3">
                {galleryImages.slice(1).map((src, i) => {
                  const index = i + 1;
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => openLightbox(index)}
                      className="gallery-tap-target group relative w-full aspect-[16/10] sm:aspect-[4/3] overflow-hidden rounded-xl sm:rounded-lg bg-gray-800 active:opacity-90"
                      aria-label={`View ${galleryLabels[index]}`}
                    >
                      <img
                        src={src}
                        alt={galleryLabels[index]}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/logo.jpg';
                        }}
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 pointer-events-none sm:hidden">
                        <span className="text-white text-xs font-medium line-clamp-2">
                          {galleryLabels[index]}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox — full screen on mobile, swipe + bottom controls */}
      {lightboxIndex !== null && galleryImages[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black touch-none"
          style={{ height: '100dvh' }}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top bar — safe area for notched phones */}
          <div
            className="flex items-center justify-between shrink-0 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2"
          >
            <p className="text-white/90 text-sm font-medium truncate pr-2">
              {galleryLabels[lightboxIndex]}
            </p>
            <button
              type="button"
              onClick={closeLightbox}
              className="gallery-tap-target flex items-center justify-center min-w-[44px] min-h-[44px] text-white bg-white/10 rounded-full active:bg-white/20"
              aria-label="Close"
            >
              <FaTimes size={22} />
            </button>
          </div>

          {/* Image + side nav (tablet/desktop) */}
          <div className="relative flex-1 flex items-center justify-center px-2 min-h-0">
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPrev}
                  className="gallery-tap-target hidden sm:flex absolute left-2 z-10 items-center justify-center min-w-[44px] min-h-[44px] text-white bg-white/10 rounded-full active:bg-white/20"
                  aria-label="Previous photo"
                >
                  <FaChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="gallery-tap-target hidden sm:flex absolute right-2 z-10 items-center justify-center min-w-[44px] min-h-[44px] text-white bg-white/10 rounded-full active:bg-white/20"
                  aria-label="Next photo"
                >
                  <FaChevronRight size={22} />
                </button>
              </>
            )}

            <div
              className="flex items-center justify-center w-full h-full"
              onClick={closeLightbox}
            >
              <img
                src={galleryImages[lightboxIndex]}
                alt={galleryLabels[lightboxIndex]}
                className="max-h-full max-w-full w-auto h-auto object-contain select-none"
                style={{ maxHeight: 'calc(100dvh - 9rem)' }}
                onClick={(e) => e.stopPropagation()}
                draggable={false}
              />
            </div>
          </div>

          {/* Bottom controls — thumb zone on mobile */}
          <div className="shrink-0 flex items-center justify-between gap-2 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 bg-gradient-to-t from-black/80 to-transparent">
            {galleryImages.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={showPrev}
                  className="gallery-tap-target flex sm:hidden items-center justify-center min-w-[48px] min-h-[48px] text-white bg-white/15 rounded-full active:bg-white/25"
                  aria-label="Previous photo"
                >
                  <FaChevronLeft size={20} />
                </button>

                <p className="flex-1 text-center text-white/70 text-sm px-1">
                  <span className="font-medium text-white/90">
                    {lightboxIndex + 1} / {galleryImages.length}
                  </span>
                  <span className="sm:hidden block text-xs text-white/50 mt-0.5">
                    Swipe left or right
                  </span>
                </p>

                <button
                  type="button"
                  onClick={showNext}
                  className="gallery-tap-target flex sm:hidden items-center justify-center min-w-[48px] min-h-[48px] text-white bg-white/15 rounded-full active:bg-white/25"
                  aria-label="Next photo"
                >
                  <FaChevronRight size={20} />
                </button>
              </>
            ) : (
              <p className="w-full text-center text-white/70 text-sm py-2">1 / 1</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
