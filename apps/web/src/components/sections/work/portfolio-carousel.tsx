"use client";

import { cn } from "@neatly/utils";
import {
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Swiper as SwiperClass } from "swiper";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import type { landingFeaturedWork } from "@/config/landing";
import { PortfolioSlide } from "./portfolio-slide";
import {
  WORK_GALLERY_LABEL,
  WORK_NEXT_PHOTO_LABEL,
  WORK_PREVIOUS_PHOTO_LABEL,
  WORK_SWIPER_AUTOPLAY_MS,
  WORK_SWIPER_DESKTOP_MIN_PX,
  WORK_SWIPER_DESKTOP_PER_VIEW,
  WORK_SWIPER_LAPTOP_MIN_PX,
  WORK_SWIPER_LAPTOP_PER_VIEW,
  WORK_SWIPER_MOBILE_PER_VIEW,
  WORK_SWIPER_REDUCED_SPEED_MS,
  WORK_SWIPER_SPACE_DESKTOP_PX,
  WORK_SWIPER_SPACE_MOBILE_PX,
  WORK_SWIPER_SPACE_TABLET_PX,
  WORK_SWIPER_SPEED_MS,
  WORK_SWIPER_TABLET_MIN_PX,
  WORK_SWIPER_TABLET_PER_VIEW,
} from "./work-animation";
import { WorkGalleryNav } from "./work-gallery-nav";
import "swiper/css";

type WorkTileItem = (typeof landingFeaturedWork.tiles)[number];

interface PortfolioCarouselProps {
  tiles: ReadonlyArray<WorkTileItem>;
}

export function PortfolioCarousel({
  tiles,
}: PortfolioCarouselProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);
  const enableAutoplay = !prefersReducedMotion && tiles.length > 1;

  const syncIndex = useCallback((instance: SwiperClass): void => {
    setActiveIndex(instance.realIndex);
  }, []);

  const pauseAutoplay = useCallback((): void => {
    if (!enableAutoplay) {
      return;
    }

    swiper?.autoplay.pause();
  }, [enableAutoplay, swiper]);

  const resumeAutoplay = useCallback((): void => {
    if (!enableAutoplay) {
      return;
    }

    swiper?.autoplay.resume();
  }, [enableAutoplay, swiper]);

  useEffect((): (() => void) => {
    const nav = navRef.current;

    if (nav === null) {
      return (): void => undefined;
    }

    const resumeIfLeaving = (event: FocusEvent): void => {
      const next = event.relatedTarget;

      if (next instanceof Node && nav.contains(next)) {
        return;
      }

      resumeAutoplay();
    };

    nav.addEventListener("pointerenter", pauseAutoplay);
    nav.addEventListener("pointerleave", resumeAutoplay);
    nav.addEventListener("focusin", pauseAutoplay);
    nav.addEventListener("focusout", resumeIfLeaving);

    return (): void => {
      nav.removeEventListener("pointerenter", pauseAutoplay);
      nav.removeEventListener("pointerleave", resumeAutoplay);
      nav.removeEventListener("focusin", pauseAutoplay);
      nav.removeEventListener("focusout", resumeIfLeaving);
    };
  }, [pauseAutoplay, resumeAutoplay]);

  useEffect((): void => {
    if (swiper === null) {
      return;
    }

    if (enableAutoplay) {
      swiper.autoplay.start();
      return;
    }

    swiper.autoplay.stop();
  }, [enableAutoplay, swiper]);

  const position = `${String(activeIndex + 1).padStart(2, "0")} / ${String(tiles.length).padStart(2, "0")}`;

  return (
    <div>
      <section
        aria-label={WORK_GALLERY_LABEL}
        aria-roledescription="carousel"
        className="overflow-hidden"
        data-lenis-prevent
        data-work-gallery=""
      >
        <Swiper
          a11y={{
            enabled: true,
            nextSlideMessage: WORK_NEXT_PHOTO_LABEL,
            prevSlideMessage: WORK_PREVIOUS_PHOTO_LABEL,
          }}
          autoplay={
            enableAutoplay
              ? {
                  delay: WORK_SWIPER_AUTOPLAY_MS,
                  disableOnInteraction: false,
                }
              : false
          }
          breakpoints={{
            [WORK_SWIPER_TABLET_MIN_PX]: {
              slidesPerView: WORK_SWIPER_TABLET_PER_VIEW,
              spaceBetween: WORK_SWIPER_SPACE_TABLET_PX,
            },
            [WORK_SWIPER_LAPTOP_MIN_PX]: {
              slidesPerView: WORK_SWIPER_LAPTOP_PER_VIEW,
              spaceBetween: WORK_SWIPER_SPACE_TABLET_PX,
            },
            [WORK_SWIPER_DESKTOP_MIN_PX]: {
              slidesPerView: WORK_SWIPER_DESKTOP_PER_VIEW,
              spaceBetween: WORK_SWIPER_SPACE_DESKTOP_PX,
            },
          }}
          centeredSlides
          className={cn(
            "[&_.swiper-wrapper]:items-end",
            "[&_.swiper-slide]:h-auto",
          )}
          grabCursor={!prefersReducedMotion}
          keyboard={{ enabled: true, onlyInViewport: true }}
          loop
          modules={[A11y, Autoplay, Keyboard]}
          onSlideChange={syncIndex}
          onSwiper={(instance): void => {
            setSwiper(instance);
            syncIndex(instance);
          }}
          slidesPerView={WORK_SWIPER_MOBILE_PER_VIEW}
          spaceBetween={WORK_SWIPER_SPACE_MOBILE_PX}
          speed={
            prefersReducedMotion
              ? WORK_SWIPER_REDUCED_SPEED_MS
              : WORK_SWIPER_SPEED_MS
          }
          touchStartPreventDefault={false}
          watchSlidesProgress
        >
          {tiles.map((tile, index) => (
            <SwiperSlide key={tile.id}>
              {({ isActive }): ReactElement => (
                <PortfolioSlide
                  isActive={isActive}
                  prefersReducedMotion={prefersReducedMotion}
                  priority={index === 0}
                  tile={tile}
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      <div className="mx-auto max-w-page px-gutter" ref={navRef}>
        <WorkGalleryNav
          canNext
          canPrevious
          onNext={(): void => {
            swiper?.slideNext();
          }}
          onPrevious={(): void => {
            swiper?.slidePrev();
          }}
          position={position}
        />
      </div>
    </div>
  );
}
