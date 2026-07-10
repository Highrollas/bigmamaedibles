'use client'

import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";


interface Props {
      label: string;
      value: string | number;
      pre?: string | ReactNode;
      apn?: string | ReactNode;
      className?: string;
      type: string;
      readOnly?: boolean;
      onChange?: (value: string) => void;
      onClick?: () => void;
}

const LabelInput = ({ label, value, pre, apn, className, type, readOnly, onChange, onClick }: Props) => {

      const [inputType, setInputType] = useState<string>("text");

      useEffect(() => {
            setInputType(type)
      }, [type])

      return (
            <div className="w-full">
                  <div className="float-label font-[550]!">{label}</div>
                  <div className="form-box-2">
                        {pre && <div className="input-prepend">{pre}</div>}
                        <input readOnly={readOnly ?? false} value={value || ""}
                              onClick={() => onClick ? onClick() : null}
                              onChange={(e) => onChange ? onChange(e.target.value) : null} type={inputType}
                              className={'text-[80%]! font-bold ' + (className ?? '') + (pre ? ' ps-1!' : '')}
                        />
                        {
                              type == "password"
                                    ?
                                    <div className="input-append">
                                          <Image alt="password open" src="/assets/images/eye-view.png" width={30} height={50} className={(inputType == "text" ? 'hidden ' : '') + 'h-3 w-7'}
                                                color="white" onClick={() => setInputType("text")} />
                                          <Image alt="password open" src="/assets/images/eye-hide.png" width={50} height={50} className={(inputType == "password" ? 'hidden ' : '') + 'h-3 w-7'}
                                                onClick={() => setInputType("password")} color="white" />
                                    </div>
                                    : apn && <div className="input-append">{apn}</div>
                        }
                  </div>
            </div>
      )
}

export default LabelInput


