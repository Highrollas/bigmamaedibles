'use client'

import { useEffect } from "react"
import { clickElement } from '@/app/Helper';

const MenuControl = () => {
      useEffect(() => {

            const elements = document.getElementsByClassName('close-category-drawer');
            Array.from(elements).forEach(el => {
                  el.addEventListener('click', () => clickElement('category-drawer'));
            });

            const elements2 = document.getElementsByClassName('close-explore-drawer');
            Array.from(elements2).forEach(el => {
                  el.addEventListener('click', () => clickElement('explore-drawer'));
            });

            const elements3 = document.getElementsByClassName('close-user-drawer');
            Array.from(elements3).forEach(el => {
                  el.addEventListener('click', () => clickElement('user-drawer'));
            });


            return () => {
                  Array.from(elements).forEach(el => {
                        el.removeEventListener('click', () => clickElement('category-drawer'));
                  });

                  Array.from(elements2).forEach(el => {
                        el.removeEventListener('click', () => clickElement('explore-drawer'));
                  });

                  Array.from(elements3).forEach(el => {
                        el.removeEventListener('click', () => clickElement('user-drawer'));
                  });
            }

      }, []);

      return <></>;
};

export default MenuControl;

