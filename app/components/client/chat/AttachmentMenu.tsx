/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react'
import { Camera, ImageIcon } from 'lucide-react'

interface AttachmentMenuProps {
      photoInputRef: any
      cameraInputRef: any
      attachmentMenuRef: any
}

export default function AttachmentMenu({
      photoInputRef,
      cameraInputRef,
      attachmentMenuRef,
}: AttachmentMenuProps) {
      return (
            <div
                  ref={attachmentMenuRef}
                  className="absolute h-[12vh] bottom-0 left-0 w-full bg-white shadow-lg flex items-center justify-around animate-slide-up"
            >
                  <div
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => cameraInputRef.current?.click()}
                  >
                        <Camera className="w-7 h-7 text-black" />
                        <span className="text-xs mt-1">Camera</span>
                  </div>
                  <div
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => photoInputRef.current?.click()}
                  >
                        <ImageIcon className="w-7 h-7 text-black" />
                        <span className="text-xs mt-1">Photos</span>
                  </div>
            </div>
      )
}

