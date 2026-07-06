"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const SCAM_ALERT_HIDE_KEY = "scam_alert_hide_until";
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export default function ScamAlert() {
      const [showScamAlert, setShowScamAlert] = useState(false);

      useEffect(() => {
            const timeoutId = window.setTimeout(() => {
                  try {
                        const hiddenUntil = Number(localStorage.getItem(SCAM_ALERT_HIDE_KEY) || 0);
                        setShowScamAlert(!hiddenUntil || Date.now() > hiddenUntil);
                  } catch {
                        setShowScamAlert(true);
                  }
            }, 2000);

            return () => window.clearTimeout(timeoutId);
      }, []);

      const hideScamAlertForThreeDays = () => {
            try {
                  localStorage.setItem(SCAM_ALERT_HIDE_KEY, String(Date.now() + THREE_DAYS_MS));
            } catch {
                  // no-op
            }
            setShowScamAlert(false);
      };

      if (!showScamAlert) {
            return null;
      }

      return (
            <div className="brand-overlay fixed inset-0 z-[999999999999999] flex items-center justify-center px-3">
                  <div className="w-full max-w-[420px] rounded-[22px] bg-[#efefef] p-5 text-center relative" style={{ zoom: .9 }}>
                        <div
                              onClick={hideScamAlertForThreeDays}
                              className="brand-badge absolute right-4 top-4 h-7 w-7 rounded-[8px] flex items-center justify-center"
                        >
                              <X className="h-5 w-5 text-white" />
                        </div>

                        <h2 className="mt-8 text-2xl font-bold">SCAM WARNING</h2>

                        <p className="mt-5 text-[12px]  px-2">
                              So We All Saw This Coming As Our Popularity Has Grown So Has The Popularity Of Little Scammers Trying To Use
                              Our Name To Scam This Lovely Community Out Of Your Hard Earned Money.
                        </p>

                        <p className="mt-3 text-[12px]  px-2">
                              We Love Our Community. You Mean The World To Us So It Is Our Duty To Keep You And Your Money Safe
                              From These Thieves.
                        </p>

                        <p className="mt-3 text-[12px]  px-2">
                              We Have Created A Dedicated Page That Shows You All The Scam Sites That Currently Exist. It Also Shows You
                              How To Prevent Yourself From Getting Scammed. Please Have A Read Over It When You Get The Chance. It Could
                              Save You From The Nasty Experience Of Being Scammed.
                        </p>

                        <div className="mt-8 mb-3">
                              <Link
                                    href="/scammers-list"
                                    onClick={hideScamAlertForThreeDays}
                                    className="flex items-center w-fit mx-auto rounded-[10px] bg-[#f61b23] px-3 py-3 text-white font-bold"
                              >
                                    <span> Scammers List</span>
                                    <span className="ps-1.5"> {"->"}</span>
                              </Link>
                        </div>
                  </div>
            </div>
      );
}

