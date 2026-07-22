/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { APP_URL } from '@/constants';
import React, { useEffect, useRef } from 'react';
import parse from 'html-react-parser';
import root from 'react-shadow';

const HtmlParser = ({ text }: { text: string }) => {
      const shadowRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
            const shadowHost = shadowRef.current;
            const shadowRoot = shadowHost?.shadowRoot;
            if (!shadowRoot) return;

            const tryApplyClass = () => {

                  const el = shadowRoot.querySelector('.wd-type');
                  if (!el) return;

                  const content = el.textContent?.toLowerCase() || '';
                  const parent = el.parentElement;
                  if (!parent) return;

                  if (content.includes('hybrid')) {
                        parent.classList.add('hybrid');
                  } else if (content.includes('indica')) {
                        parent.classList.add('indica');
                  } else {
                        parent.classList.add('sativa');
                  }
            };

            setTimeout(tryApplyClass, 10);

      }, [text]);

      return (
            <root.div id="shadow-wrapper" ref={shadowRef}>
                  <link
                        rel="stylesheet"
                        href={APP_URL + '/assets/css/bootstrap.min.css'}
                  />
                  <link
                        rel="stylesheet"
                        href={APP_URL + '/assets/css/desc-styles.css?v=4'}
                  />
                  <div>{parse(text)}</div>
            </root.div>
      );
};

export default HtmlParser;


