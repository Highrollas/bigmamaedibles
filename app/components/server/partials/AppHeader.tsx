import React from 'react';
import Menu from './Menu/Menu';
import NotificationMarque from '../NotificationMarque';
import FallbackImage from '../../client/FallbackImage';

const AppHeader = () => {
      return (
            <div id='header'>
                  <div className='brand-hero h-[20dvh] sm:h-[30dvh] lg:h-[40dvh] text-white flex items-center justify-start overflow-hidden ps-6'>
                        <FallbackImage className='h-[10dvh] sm:h-[15dvh] lg:h-[20dvh] w-auto' src="/assets/images/logo-white.png" width={1200} height={1200} alt='Bigmamasedibles logo white' />
                  </div>
                  <div className="mt-[-10px]">
                        <NotificationMarque />
                  </div>
                  <Menu />
            </div>
      )
}

export default AppHeader

