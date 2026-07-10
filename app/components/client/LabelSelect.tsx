import { ReactNode } from "react";

interface Props {
      label: string;
      ref?: unknown;
      pre?: string | ReactNode;
      apn?: string | ReactNode;
      className?: string;
      options: string[];
      defaultOption?: string;
      onChange: (value: string) => void;
}

const LabelSelect = ({ label, pre, apn, className, defaultOption, options, onChange }: Props) => {
      return (
            <div className="w-full">
                  <div className="float-label font-[550]! tracking-[1px]">{label}</div>
                  <div className="form-box-2">
                        {pre && <div className="input-prepend">{pre}</div>}
                        <select onChange={(e) => onChange(e.target.value)} className={'text-[80%]! font-bold ' + (className ?? '')} >
                              <option value="">{defaultOption ?? 'Select An Option Below'}</option>
                              {
                                    options.map((op, i) => <option value={op} key={i}>{op}</option>)
                              }
                        </select>
                        {apn && <div className="input-append">{apn}</div>}
                  </div>
            </div>
      )
}

export default LabelSelect


