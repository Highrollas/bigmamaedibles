'use client'

import { create } from 'zustand';
import { produce } from 'immer';
import { BillingObj, RegistrationObj } from '@/Interface';
import { EMPTY_BILLING_OBJ } from '@/constants';


type regStage = "form" | "verify-code" | "address" | "profile-image";

interface RegistrationState {
      registrationObj: RegistrationObj;
      setRegistrationObj: (updater: (prev: RegistrationObj) => void) => void;
      regStage: regStage,
      setRegStage: (stage: regStage) => void;
      isBillingObjValid: boolean;
}


const validatebillingObj = (obj: BillingObj): boolean => {
      return Boolean(
            obj.firstName &&
            obj.lastName &&
            obj.email &&
            obj.addressObj.country &&
            obj.addressObj.city &&
            obj.addressObj.street &&
            obj.addressObj.postcode
      );
};

const useRegistrationStore = create<RegistrationState>((set, get) => ({

      registrationObj: {
            username: "",
            email: "",
            password: "",
            rePassword: "",
            referralCoupon: "",
            verificationCode: "",
            billingObj: EMPTY_BILLING_OBJ,
            avatar: "baller"
      },

      regStage: "form",

      setRegistrationObj: (updater) => {
            set((state) => ({ registrationObj: produce(state.registrationObj, updater) }));
            set({ isBillingObjValid: validatebillingObj(get().registrationObj.billingObj) });
      },

      setRegStage: (newStage) => set({ regStage: newStage }),

      isBillingObjValid: false

}));

export default useRegistrationStore;

