import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
import { ProductObj } from "@/Interface";
import ProductImageUploader from "./ProductImageUploader ";


const ProductImages = ({
      productObj,
      setProductObj,
}: {
      productObj: ProductObj;
      setProductObj: (updater: (prev: ProductObj) => void) => void;
}) => {
      const [dragIndex, setDragIndex] = useState<number | null>(null);

      const handleDelete = (index: number) => {
            setProductObj((d) => {
                  d.images = d.images.filter((_, i) => i !== index);
            });
      };

      const handleDragStart = (index: number) => {
            setDragIndex(index);
      };

      const handleDrop = (index: number) => {
            if (dragIndex === null || dragIndex === index) return;

            setProductObj((d) => {
                  const newImages = [...d.images];
                  const [moved] = newImages.splice(dragIndex, 1);
                  newImages.splice(index, 0, moved);
                  d.images = newImages;
            });
            setDragIndex(null);
      };

      return (
            <div className="w-full mt-4 flex">

                  <div>
                        <label htmlFor="">Product Image</label>
                        <ProductImageUploader setProductObj={setProductObj} />
                  </div>

                  <div className="flex gap-2 ml-3 flex-wrap">
                        {productObj.images.map((img, i) => (
                              <div
                                    key={i}
                                    draggable
                                    onDragStart={() => handleDragStart(i)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => handleDrop(i)}
                                    className="relative border brand-border rounded overflow-hidden group"
                              >
                                    <Image src={img} alt={`image-${i}`} height={75} width={75} />
                                    <div
                                          onClick={() => handleDelete(i)}
                                          className="absolute brand-panel top-0 right-0 text-white text-xs p-1 rounded-bl"
                                    >
                                          <X size={12} />
                                    </div>
                              </div>
                        ))}
                  </div>
            </div>
      );
};

export default ProductImages;

