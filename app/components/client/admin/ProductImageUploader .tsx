'use client';

import { ProductObj } from '@/Interface';
import { CldUploadWidget } from 'next-cloudinary';

interface Props {
      setProductObj: (updater: (prev: ProductObj) => void) => void;
}

const ProductImageUploader = ({ setProductObj }: Props) => {


      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleUpload = (result: any) => {
            if (result.event === 'success') {
                  setProductObj((d) => { d.images = [...d.images, result.info.secure_url] });
            }
      };

      return (
            <div className="w-full flex gap-4 mt-4">
                  {/* Left: Upload Button */}
                  <div className="w-[30%]">
                        <CldUploadWidget
                              uploadPreset="productsImagePreset"
                              options={{
                                    multiple: true
                              }}
                              onSuccess={handleUpload}

                        >
                              {({ open }) => (
                                    <button type="button" className="btn btn-sm btn-outline!" onClick={() => open()}>
                                          Upload
                                    </button>
                              )}
                        </CldUploadWidget>
                  </div>

            </div>
      );
};

export default ProductImageUploader;


