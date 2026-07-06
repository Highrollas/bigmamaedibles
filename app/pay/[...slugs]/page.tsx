import BchPayment from '@/app/components/client/BchPayment';
import WertPayment from '@/app/components/client/WertPayment';
import React from 'react'

interface Props {
      params: Promise<{ slugs: string[] }> | undefined;
}

const PaymentPage = async ({ params }: Props) => {

      if (!params) return;

      const { slugs } = await params;

      const paymentMethod = slugs[0];
      const txId = slugs[1];

      return (
            <div>
                  {paymentMethod === "wert" && <WertPayment transactionId={txId} />}
                  {(paymentMethod === "moonpay" || paymentMethod === "bch") && <BchPayment alias={paymentMethod} transactionId={txId} />}
            </div>
      );
}

export default PaymentPage

