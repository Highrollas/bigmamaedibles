import { flattenErrorMessage } from "@/app/Helper";
import { getAddressFromCache, getPostcodeFromCache, saveAddressToCache, savePostcodeToCache } from "@/libs/postcodeCache";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const postcodeSchema = z.object({
      postcode: z
            .string()
            .min(3, "Enter At Least The First 3 Letters Of Your Postcode")
            .max(10, "Postcode Must Be At Most 10 Characters"),
});

const addressIdSchema = z.object({
      id: z.string().min(1, "Address ID is required")
});

export async function POST(req: NextRequest) {
      try {
            const body = await req.json();
            const POSTGRID_API_KEY = "live_sk_wPUzNwqHCrx2VAQJJaVCr8";

            if (!POSTGRID_API_KEY) {
                  console.error("Missing POSTGRID_API_KEY");
                  return NextResponse.json({
                        status: "failed",
                        message: "Server configuration error"
                  }, { status: 500 });
            }

            // Check if request is for full address details by id
            if (body.id) {

                  const idResult = addressIdSchema.safeParse(body);

                  if (!idResult.success) {
                        return NextResponse.json({
                              status: "failed",
                              message: flattenErrorMessage(idResult)
                        }, { status: 400 });
                  }

                  // Check cache first
                  const cachedAddress = await getAddressFromCache(body.id);
                  if (cachedAddress) {
                        return NextResponse.json({
                              status: "success",
                              addressDetails: cachedAddress
                        });
                  }

                  const resp = await axios.post(
                        "https://api.postgrid.com/v1/intl_addver/completions",
                        { id: body.id },
                        {
                              headers: {
                                    "x-api-key": POSTGRID_API_KEY,
                                    "Content-Type": "application/json"
                              }
                        }
                  );

                  // Save to cache
                  await saveAddressToCache(body.id, resp.data.data);

                  return NextResponse.json({
                        status: "success",
                        addressDetails: resp.data.data
                  });
            }

            // Otherwise, search by postcode
            const result = postcodeSchema.safeParse(body);

            if (!result.success) {
                  return NextResponse.json({
                        status: "failed",
                        message: flattenErrorMessage(result)
                  }, { status: 400 });
            }

            const { postcode } = result.data;

            // Check cache first
            const cachedPostcodes = await getPostcodeFromCache(postcode);
            if (cachedPostcodes) {
                  return NextResponse.json({
                        status: "success",
                        addresses: cachedPostcodes
                  });
            }

            const resp = await axios.get(
                  "https://api.postgrid.com/v1/intl_addver/completions",
                  {
                        params: {
                              partialStreet: postcode.trim(),
                              countriesFilter: "United Kingdom",
                              limit: 100,
                              language: "EN"
                        },
                        headers: {
                              "x-api-key": POSTGRID_API_KEY
                        }
                  }
            );

            const addresses = resp.data.data || [];

            // Save to cache
            await savePostcodeToCache(postcode, addresses);

            return NextResponse.json({
                  status: "success",
                  addresses
            });

      } catch (err) {
            console.error("Catch err @postcode", err);
            return NextResponse.json({
                  status: "failed",
                  message: "Error Fetching Postcode"
            }, { status: 500 });
      }
}
