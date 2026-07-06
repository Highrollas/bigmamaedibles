/* eslint-disable @typescript-eslint/no-explicit-any */

import { OrderObj } from "@/Interface";

interface DHLCreateResponse {
      shipmentId?: string;
      label?: {
            url?: string;
      };
      [key: string]: any;
}

export const createDHLShipment = async (order: OrderObj) => {
      try {
            // --- Validate environment variables ---
            const {
                  DHL_USERNAME,
                  DHL_PASSWORD,
                  DHL_ACCOUNT_NUMBER,
                  DHL_API_BASE,
                  DHL_SENDER_NAME,
                  DHL_SENDER_PHONE,
                  DHL_SENDER_EMAIL,
                  DHL_SENDER_ADDRESS1,
                  DHL_SENDER_TOWN,
                  DHL_SENDER_POSTCODE,
            } = process.env;

            if (
                  !DHL_USERNAME ||
                  !DHL_PASSWORD ||
                  !DHL_ACCOUNT_NUMBER ||
                  !DHL_API_BASE
            ) {
                  throw new Error("Missing DHL API credentials or base URL");
            }

            // --- Prepare DHL payload ---
            const dhlPayload = {
                  collectionDetails: {
                        contactName: DHL_SENDER_NAME || "Warehouse",
                        phoneNumber: DHL_SENDER_PHONE || "",
                        email: DHL_SENDER_EMAIL || "",
                        address: {
                              addressLine1: DHL_SENDER_ADDRESS1 || "",
                              town: DHL_SENDER_TOWN || "",
                              postcode: DHL_SENDER_POSTCODE || "",
                              countryCode: "GB",
                        },
                  },
                  deliveryDetails: {
                        contactName: `${order.billingObj.firstName} ${order.billingObj.lastName}`,
                        phoneNumber: "",
                        email: order.billingObj.email || "",
                        address: {
                              addressLine1: order.billingObj.addressObj.street || "",
                              town: order.billingObj.addressObj.city || "",
                              postcode: order.billingObj.addressObj.postcode || "",
                              countryCode: "GB",
                        },
                  },
                  parcels: [
                        {
                              weight: 1,
                              packageDescription: `Order #${order.orderId}`,
                              customerReference: order.orderId,
                        },
                  ],
                  product: "NextDay",
                  billing: {
                        accountNumber: DHL_ACCOUNT_NUMBER,
                  },
            };

            // --- Send request to DHL API ---
            const authHeader = `Basic ${Buffer.from(
                  `${DHL_USERNAME}:${DHL_PASSWORD}`
            ).toString("base64")}`;

            const response = await fetch(`${DHL_API_BASE}/v2/shipments`, {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                        Authorization: authHeader,
                  },
                  body: JSON.stringify(dhlPayload),
            });

            const data: DHLCreateResponse = await response.json();

            // --- Handle possible API errors ---
            if (!response.ok || !data?.shipmentId) {
                  console.error("DHL API error response:", data);
                  throw new Error(
                        data?.errorMessage || "Failed to create DHL shipment"
                  );
            }

            // --- Return DHL shipment info ---
            return {
                  success: true,
                  shipmentId: data.shipmentId,
                  labelUrl: data.label?.url,
            };
      } catch (error) {
            console.error("DHL Shipment creation failed:", error);
            return {
                  success: false,
                  error:
                        error instanceof Error ? error.message : "Unknown DHL API error",
            };
      }
};
