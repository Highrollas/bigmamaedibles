'use client';

import { useEffect } from 'react';

const AutoScroller = ({ scrollClass }: { scrollClass: string }) => {
      useEffect(() => {
            const ulElements = document.querySelectorAll<HTMLElement>('.' + scrollClass);
            const timers = new Map<HTMLElement, NodeJS.Timeout>();

            const scrollInterval = 20;
            const scrollSpeed = 1;

            const startScrolling = (el: HTMLElement) => {
                  if (timers.has(el)) return; // Avoid multiple intervals
                  const timer = setInterval(() => {
                        el.scrollBy(scrollSpeed, 0);
                        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
                              el.scrollLeft = 0;
                        }
                  }, scrollInterval);
                  timers.set(el, timer);
            };

            const stopScrolling = (el: HTMLElement) => {
                  const timer = timers.get(el);
                  if (timer) {
                        clearInterval(timer);
                        timers.delete(el);
                  }
            };

            ulElements.forEach((el) => {
                  startScrolling(el);

                  const handleMouseDown = () => stopScrolling(el);
                  const handleMouseUp = () => startScrolling(el);

                  el.addEventListener('mousedown', handleMouseDown);
                  el.addEventListener('touchstart', handleMouseDown);
                  el.addEventListener('mouseup', handleMouseUp);
                  el.addEventListener('touchend', handleMouseUp);
                  el.addEventListener('mouseleave', handleMouseUp);

                  // Cleanup on unmount
                  return () => {
                        stopScrolling(el);
                        el.removeEventListener('mousedown', handleMouseDown);
                        el.removeEventListener('touchstart', handleMouseDown);
                        el.removeEventListener('mouseup', handleMouseUp);
                        el.removeEventListener('touchend', handleMouseUp);
                        el.removeEventListener('mouseleave', handleMouseUp);
                  };
            });

            // Final cleanup
            return () => {
                  ulElements.forEach((el) => stopScrolling(el));
            };
      }, [scrollClass]);

      return null;
};

export default AutoScroller;

