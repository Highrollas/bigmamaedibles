'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import FallbackImage from './FallbackImage';
import ImageSlider from './ImageSlider';

interface Props {
      images: string[];
      productName: string;
}

const ProductImageCarousel = ({ images, productName }: Props) => {
      const [activeIndex, setActiveIndex] = useState(0);
      const carouselRef = useRef<HTMLDivElement>(null);
      const isProgrammaticRef = useRef(false);
      const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
      const observerRef = useRef<IntersectionObserver | null>(null);

      useEffect(() => {
            const carousel = carouselRef.current;
            if (!carousel) return;

            // IntersectionObserver fires reliably on iOS Safari during and after touch swipes
            observerRef.current = new IntersectionObserver(
                  (entries) => {
                        // Ignore observer callbacks triggered by programmatic dot-click scrolls
                        if (isProgrammaticRef.current) return;

                        entries.forEach((entry) => {
                              if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                                    const items = Array.from(carousel.querySelectorAll('.carousel-item'));
                                    const index = items.indexOf(entry.target as HTMLElement);
                                    if (index !== -1) setActiveIndex(index);
                              }
                        });
                  },
                  {
                        root: carousel,
                        // Item must be at least 50% visible to be considered "active"
                        threshold: 0.5,
                  }
            );

            const items = carousel.querySelectorAll('.carousel-item');
            items.forEach((item) => observerRef.current!.observe(item));

            return () => {
                  observerRef.current?.disconnect();
                  if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
            };
      }, [images]);  // re-run if images change

      const scrollToIndex = useCallback((index: number) => {
            const carousel = carouselRef.current;
            if (!carousel) return;

            const items = carousel.querySelectorAll('.carousel-item');
            const target = items[index] as HTMLElement;
            if (!target) return;

            // Suppress the observer while we programmatically scroll
            isProgrammaticRef.current = true;
            setActiveIndex(index);

            carousel.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });

            // Release the lock once scrolling settles.
            // 'scrollend' is not supported on iOS Safari, so we always use a timeout fallback.
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = setTimeout(() => {
                  isProgrammaticRef.current = false;
            }, 600);
      }, []);

      if (images.length === 0) return null;

      return (
            <div>
                  <div
                        className="carousel w-full"
                        ref={carouselRef}
                        // Required for IntersectionObserver root + smooth iOS scrolling
                        style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                        {images.map((img, index) => (
                              <div
                                    key={index}
                                    id={`item${index}`}
                                    className={`carousel-item ${images.length > 1 ? 'w-[100.4%]' : 'w-[100%]'}`}
                              >
                                    <FallbackImage
                                          className="rounded-[0.375rem]"
                                          src={img}
                                          alt={productName}
                                          width={1200}
                                          height={1200}
                                    />
                              </div>
                        ))}
                  </div>

                  <ImageSlider
                        itemsLength={images.length}
                        activeIndex={activeIndex}
                        onIndexChange={scrollToIndex}
                  />
            </div>
      );
};

export default ProductImageCarousel;

