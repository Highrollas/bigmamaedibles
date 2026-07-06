/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import { Copy, UploadCloud } from 'lucide-react';

const MediaUploader = () => {
      const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

      const handleUpload = (result: any) => {
            setUploadedUrl(result?.info?.secure_url);
      };

      const handleCopy = () => {
            if (uploadedUrl) {
                  navigator.clipboard.writeText(uploadedUrl);
            }
      };

      return (
            <div className="flex items-center gap-3">

                  <CldUploadWidget uploadPreset="MediaFilesPreset" onSuccess={handleUpload}>
                        {({ open }) => (
                              <UploadCloud className='text-white pointer' size="32" onClick={() => open()} />
                        )}
                  </CldUploadWidget>

                  {uploadedUrl && (
                        <div className="flex items-center gap-2">
                              <a
                                    href={uploadedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 text-sm max-w-[200px] truncate underline"
                              >
                                    {uploadedUrl}
                              </a>
                              <button onClick={handleCopy} className="btn btn-sm btn-ghost">
                                    <Copy className="w-4 h-4" />
                              </button>
                        </div>
                  )}
            </div>
      );
};

export default MediaUploader;

