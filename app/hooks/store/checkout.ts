'use client'

import { CheckoutObj } from "@/Interface"
import { create } from "zustand"
import { produce } from "immer"
import { EMPTY_BILLING_OBJ } from "@/constants";

interface CheckoutStore {
      checkoutObj: CheckoutObj;
      setCheckoutObj: (updater: (prev: CheckoutObj) => void) => void;
      isValid: boolean;
}

const validateCheckout = (obj: CheckoutObj): boolean => {
      return Boolean(
            obj.cartItems.length &&
            obj.billingObj.firstName &&
            obj.billingObj.lastName &&
            obj.billingObj.email &&
            obj.billingObj.addressObj.country &&
            obj.billingObj.addressObj.city &&
            obj.billingObj.addressObj.street &&
            obj.billingObj.addressObj.postcode &&
            obj.paymentGatewayAlias &&
            obj.shippingMethodAlias &&
            obj.termsAndCondtionAccepted
      );
};

const useCheckoutStore = create<CheckoutStore>((set) => ({
      checkoutObj: {
            cartItems: [],
            billingObj: EMPTY_BILLING_OBJ,
            paymentGatewayAlias: "onramp",
            shippingMethodAlias: "24hrs-delivery",
            termsAndCondtionAccepted: false,
            coupons: [],
            useBalance: "0",
      },
      setCheckoutObj: (updater) =>
            set((state) => {
                  const next = produce(state.checkoutObj, updater);
                  return {
                        checkoutObj: next,
                        isValid: validateCheckout(next),
                  };
            }),
      isValid: false
}));

export default useCheckoutStore;

