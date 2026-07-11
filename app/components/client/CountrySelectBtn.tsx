import { ShippingCountries } from "@/Interface";
import { XIcon } from "lucide-react";
import Image from "next/image";

interface Props {
      imageUrl: string;
      label: ShippingCountries;
      onClick?: (v: ShippingCountries) => void;
      selectedCountry: ShippingCountries;
      handleUnselect?: () => void;
}

const CountrySelectBtn = ({ imageUrl, label, onClick, selectedCountry, handleUnselect }: Props) => {

      return (
            <div onClick={() => onClick ? onClick(label) : null} className='relative w-full flex border-[3.5px] cursor-pointer border-[#e21893] rounded-[5px]'>
                  <div className="bg-[#e21893] w-[25%]">
                        <Image width={250} height={250} className="w-full rounded-s-[3px] bg-white" src={imageUrl} alt='england' />
                  </div>
                  <div className='w-[75%] flex items-center justify-center border-l-[3px] rounded-e-[3px] border-[#e21893] bg-white'>
                        <span className="text-[80%] font-[550]!">{label}</span>
                  </div>
                  {
                        selectedCountry === label &&
                        <div className="absolute top-[-10px] right-[-25px]"
                              onClick={() => handleUnselect ? handleUnselect() : null} >
                              {<XIcon color="black" size={17} strokeWidth={4} />}
                        </div>
                  }
            </div>
      )
}

export default CountrySelectBtn


