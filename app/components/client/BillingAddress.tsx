/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useEffect, useState } from 'react'
import { BillingObj, ShippingCountriesObj } from '@/Interface';
import { SHIPPING_COUNTRIES } from '@/constants';
import LabelInput from './LabelInput';
import CountrySelectBtn from './CountrySelectBtn';
// import APIClient from '@/app/services/apiClient';
// import LabelSelect from './LabelSelect';
// import useAlertStore from '@/app/hooks/store/alert';

// interface AddressCompletion {
//       id: string;
//       text: string;
//       type: string;
// }

// interface fetchPostCodeResp {
//       status: string;
//       message: string;
//       addresses: AddressCompletion[];
// }

// interface AddressDetails {
//       city: string;
//       country: string;
//       countryCode: string;
//       formattedAddress: string;
//       line1: string;
//       line2?: string;
//       line3?: string;
//       postalOrZip: string;
//       provinceOrState: string;
// }

// interface fetchAddressDetailsResp {
//       status: string;
//       message?: string;
//       addressDetails: AddressDetails;
// }

interface Props {
      billingObj: BillingObj,
      setBillingObj: (updater: (prev: BillingObj) => void) => void;
      showNickname?: boolean;
      hideEmail?: boolean;
}

const BillingAddress = ({ billingObj, setBillingObj, showNickname = false, hideEmail = false }: Props) => {

      const [selectedCountry, setSelectedCountry] = useState<ShippingCountriesObj | null>();

      // const [suggestedAddressFetched, setSuggestedAddressFetched] = useState<boolean>(false);
      const [addressSelected, setAddressSelected] = useState<boolean>(false);
      // const [suggestedAddresses, setSuggestedAddresses] = useState<AddressCompletion[]>([]);
      // const [fetchingPostcode, setFetchingPostcode] = useState<boolean>(false);
      // const [fetchingAddressDetails, setFetchingAddressDetails] = useState<boolean>(false);
      // const { setModalMessage } = useAlertStore();

      // const fetchPostCode = async () => {

      //       if (billingObj.addressObj.postcode === "") {
      //             return setModalMessage("Enter At Least The First 3 Letters Of Your Postcode");
      //       }

      //       setFetchingPostcode(true);
      //       const reqObj = { postcode: billingObj.addressObj.postcode }
      //       const resp = await new APIClient<fetchPostCodeResp>('postcode').post(reqObj);
      //       if (resp.status == "success") {
      //             setSuggestedAddresses(resp.addresses || []);
      //             setSuggestedAddressFetched(true);
      //       } else {
      //             setModalMessage(resp.message || "Error fetching addresses");
      //       }

      //       setFetchingPostcode(false);
      // }

      // const fetchAddressDetails = async (addressId: string) => {
      //       setFetchingAddressDetails(true);
      //       const reqObj = { id: addressId };
      //       const resp = await new APIClient<fetchAddressDetailsResp>('postcode').post(reqObj);

      //       if (resp.status === "success" && resp.addressDetails) {
      //             const details = resp.addressDetails;
      //             const addressParts = [details.line1];

      //             if (details.line2) addressParts.push(details.line2);
      //             if (details.line3) addressParts.push(details.line3);

      //             setBillingObj((d) => {
      //                   d.addressObj.street = addressParts.join(", ");
      //                   d.addressObj.city = details.city;
      //                   d.addressObj.postcode = details.postalOrZip;
      //                   d.addressObj.state = details.provinceOrState || "";
      //             });

      //             setAddressSelected(true);
      //       } else {
      //             setModalMessage(resp.message || "Error fetching address details");
      //       }

      //       setFetchingAddressDetails(false);
      // }


      // const handleAddressSelected = (selectedValue: string) => {
      //       // Find the selected address object by its text value
      //       const selectedAddress = suggestedAddresses.find(addr => addr.text === selectedValue);

      //       if (selectedAddress) {
      //             // Fetch full address details using the id
      //             fetchAddressDetails(selectedAddress.id);
      //       }
      // }

      useEffect(() => {

            if (billingObj.addressObj.country != "") {
                  const selectedCountryObj = SHIPPING_COUNTRIES.find(sc => sc.name === billingObj.addressObj.country);
                  setSelectedCountry(selectedCountryObj);
            }

            if (billingObj.addressObj.city != "" &&
                  billingObj.addressObj.street != "" &&
                  billingObj.addressObj.postcode != "") {
                  setAddressSelected(true);
            }

      }, [])

      return (
            <>

                  <div className='flex justify-between flex-wrap'>

                        {
                              showNickname &&
                              <div className="w-[100%] mt-5">
                                    <LabelInput value={billingObj.addressObj.nickname!} type='string' label='Address Nickname'
                                          onChange={(v) => setBillingObj(d => { d.addressObj.nickname = v })} />
                              </div>
                        }

                        <div className="w-[49%] mt-5">
                              <LabelInput value={billingObj.firstName} type='string' label='First Name'
                                    onChange={(v) => setBillingObj(d => { d.firstName = v })} />
                        </div>
                        <div className="w-[49%] mt-5">
                              <LabelInput value={billingObj.lastName} type='string' label='Last Name'
                                    onChange={(v) => setBillingObj(d => { d.lastName = v })} />
                        </div>
                  </div>

                  <div className='mt-5'>
                        <div className='bg-[#e21893] w-fit text-white px-3 text-[9px] font-[550]! tracking-[1px] rounded leading-[25px]!'>Select Your Country</div>
                  </div>

                  <div className='flex justify-between flex-wrap'>

                        {!selectedCountry &&
                              SHIPPING_COUNTRIES.map((c, i) =>
                                    <div key={i} className="w-[49%] sm:w-[24%] mt-5">
                                          <CountrySelectBtn label={c.name} imageUrl={c.imageUrl}
                                                selectedCountry={billingObj.addressObj.country}
                                                onClick={(v) => {
                                                      setBillingObj(d => { d.addressObj.country = v });
                                                      setSelectedCountry(c);
                                                      setAddressSelected(true);
                                                }}
                                          />
                                    </div>
                              )
                        }

                        {selectedCountry &&
                              <div className="w-[49%] sm:w-[24%] mt-5">
                                    <CountrySelectBtn label={selectedCountry.name} imageUrl={selectedCountry.imageUrl}
                                          selectedCountry={billingObj.addressObj.country}
                                          handleUnselect={() => {
                                                setSelectedCountry(null);
                                                setAddressSelected(false);
                                                // setSuggestedAddressFetched(false);
                                                setBillingObj(d => { d.addressObj.country = "" })
                                          }}
                                    />
                              </div>
                        }

                        {selectedCountry &&

                              <div className="w-full flex mt-5 justify-between items-end">
                                    <div className='w-full'>
                                          <LabelInput value={billingObj.addressObj.postcode} className='uppercase' type='text' label='Post Code'
                                                onChange={(v) => setBillingObj(d => { d.addressObj.postcode = v })} />
                                    </div>
                                    {/* <button disabled={fetchingPostcode} className="btn btn-sm w-[31%] text-[65%]! p-1! py-5! tracking-tight"
                                          onClick={() => fetchPostCode()}>
                                          {!fetchingPostcode && "Find Address"}
                                          {fetchingPostcode && <span className="loading loading-spinner w-5 h-5 border-white"></span>}
                                    </button>
                                    <button className="btn btn-sm w-[31%] text-[65%]! p-1! py-5!"
                                          onClick={() => {
                                                if (billingObj.addressObj.postcode.length >= 5) {
                                                      setAddressSelected(true)
                                                } else {
                                                      setAddressSelected(false)
                                                      setModalMessage("Kindly Enter A Valid Postcode")
                                                }

                                          }}>Enter Manually</button> */}
                              </div>
                        }


                        {/* {suggestedAddressFetched &&
                              <>
                                    <div className="w-[100%] mt-5">
                                          {fetchingAddressDetails ? (
                                                <div className="flex justify-center items-center py-8">
                                                      <span className="loading loading-spinner w-8 h-8"></span>
                                                </div>
                                          ) : (
                                                <LabelSelect
                                                      options={suggestedAddresses.map(addr => addr.text)}
                                                      label='Select Address'
                                                      onChange={(v) => handleAddressSelected(v)}
                                                />
                                          )}
                                    </div>
                              </>
                        } */}


                        {addressSelected &&
                              <>
                                    <div className="w-[100%] mt-5">
                                          <LabelInput value={billingObj.addressObj.street} type='text' label='House Number And Steet Address'
                                                onChange={(v) => setBillingObj(d => { d.addressObj.street = v })} />
                                    </div>


                                    <div className="w-[100%] mt-5">
                                          <LabelInput value={billingObj.addressObj.city} type='text' label='City  / Town'
                                                onChange={(v) => setBillingObj(d => { d.addressObj.city = v })} />
                                    </div>

                                    {!hideEmail &&
                                          <div className="w-[100%] mt-5">
                                                <LabelInput value={billingObj.email} type='text' label='Email Address'
                                                      onChange={(v) => setBillingObj(d => { d.email = v })} />
                                          </div>
                                    }

                              </>

                        }

                  </div>
            </>
      )
}

export default BillingAddress


