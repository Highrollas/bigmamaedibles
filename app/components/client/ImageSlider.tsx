'use client';

import React from 'react';

interface Props {
      itemsLength: number;
      activeIndex?: number;
      onIndexChange?: (index: number) => void;
}

const ImageSlider = ({ itemsLength, activeIndex = 0, onIndexChange }: Props) => {
      if (itemsLength === 1) return null;

      return (
            <div className="flex w-full justify-center gap-2 py-2">
                  {Array.from({ length: itemsLength }, (_, i) => i).map((index) => (
                        <button          // 👈 button instead of <a href>, no anchor jump
                              key={index}
                              onClick={() => onIndexChange?.(index)}
                              className={`rounded-full! p-3! h-[15px] w-[15px] brand-panel transition-opacity duration-300 ${activeIndex === index ? 'opacity-100' : 'opacity-25'
                                    }`}
                        />
                  ))}
            </div>
      );
};

export default ImageSlider;
