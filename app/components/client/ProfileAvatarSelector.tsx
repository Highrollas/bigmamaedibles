import { PROFILE_AVATARS } from '@/constants'
import Image from 'next/image'
import React from 'react'
import AlertMessage2 from './AlertMessage2'


interface Props {
      selectedAvatarAlias: string;
      setSelectedAvater: (v: string) => void;
}

const ProfileAvatarSelector = ({ selectedAvatarAlias, setSelectedAvater }: Props) => {

      const selectedAvatar = PROFILE_AVATARS.find(a => a.alias === selectedAvatarAlias) || PROFILE_AVATARS[0];

      return (

            <div>

                  <div className="mt-2 mb-5 text-center">
                        <Image className='mx-auto' height="150" width="150" src={selectedAvatar.imageUrl} alt="address image" />
                  </div>

                  <div className="w-full">

                        <AlertMessage2 />

                        <h1 className='font-bold! text-[90%] mb-3'>Select Your Avater</h1>

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 w-full mx-auto">
                              {
                                    PROFILE_AVATARS.map(a =>
                                          <div key={a.alias} className='border-3 brand-border relative h-[100px] flex justify-center items-end cursor-pointer rounded-[8px] overflow-hidden bg-white'
                                                onClick={() => setSelectedAvater(a.alias)}>
                                                <Image src={a.imageUrl} width={250} height={250} alt={a.name} className='h-[80px] w-[80px]' />
                                                <div className='bg-[#e21893] absolute top-[-1px] left-[-1px] text-white text-[60%] px-2 leading-[15px]! font-[550]! text-center'>{a.name}</div>
                                          </div>
                                    )
                              }
                        </div>

                  </div>
            </div>
      )
}

export default ProfileAvatarSelector


