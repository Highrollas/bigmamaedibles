/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Image, { ImageProps } from 'next/image'
import React, { useState } from 'react'
import notFoundImg from '@/public/assets/images/notFoundImage.jpg'


const FallbackImage = (props: ImageProps) => {

      const [errorCount, setErrorCount] = useState(0);

      const p = { ...props } as ImageProps as { src?: string; alt?: string };
      delete p.src;
      delete p.alt;


      let srcToUse: any = props.src;
      if (errorCount === 1) {
            const srcStr = typeof props.src === 'string' ? props.src : String(props.src);
            const hasQuery = srcStr.includes('?');
            srcToUse = hasQuery
                  ? `${srcStr}&v=${new Date().getTime()}`
                  : `${srcStr}?v=${new Date().getTime()}`;
      } else if (errorCount >= 2) {
            srcToUse = notFoundImg;
      }

      return (
            <Image
                  src={srcToUse}
                  alt={props.alt}
                  {...p}
                  onError={() => setErrorCount((c) => c + 1)}
            />
      );
}

export default FallbackImage


