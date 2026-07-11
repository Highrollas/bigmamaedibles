/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

import useChatsStore from "@/app/hooks/store/Chat";

const FullScreenImageViewer: React.FC = () => {
      const { chats, fullscreenImage, setFullscreenImage } = useChatsStore();
      const scrollContainerRef = useRef<HTMLDivElement>(null);
      const thumbsRef = useRef<HTMLDivElement>(null);

      const chat = chats.find((c) => c._id === fullscreenImage?.chatId);

      const mediaMessages = chat?.messages.filter(
            (m) => m.type === "media" && m.mediaUrl
      );

      const [activeIndex, setActiveIndex] = useState<number>(0);

      // Current message shown in fullscreen — use the active indexed media message when available
      const currentMessage = mediaMessages?.[activeIndex] ?? fullscreenImage!.messageObj;

      // Set initial active index and scroll to it when opening a fullscreen image
      useEffect(() => {
            if (!mediaMessages || !fullscreenImage) return;
            const idx = mediaMessages.findIndex(
                  (m) => m.id === fullscreenImage.messageObj.id
            );
            const resolved = idx >= 0 ? idx : 0;
            setActiveIndex(resolved);
            if (!scrollContainerRef.current) return;
            const container = scrollContainerRef.current;
            const child = container.children[resolved] as HTMLElement;
            if (child) {
                  container.scrollTo({
                        left: child.offsetLeft - container.offsetLeft,
                        behavior: "smooth",
                  });
            }
      }, [fullscreenImage?.messageObj.id, mediaMessages?.length]);

      // Update activeIndex while the user scrolls/swipes
      const handleScroll = () => {
            if (!scrollContainerRef.current || !mediaMessages) return;
            const container = scrollContainerRef.current;
            const idx = Math.round(container.scrollLeft / container.clientWidth);
            const bounded = Math.max(0, Math.min(idx, mediaMessages.length - 1));
            if (bounded !== activeIndex) setActiveIndex(bounded);
      };

      // Ensure highlighted thumbnail is visible inside the thumbnail scroller
      useEffect(() => {
            if (!thumbsRef.current || !mediaMessages) return;
            const container = thumbsRef.current;
            const child = container.children[activeIndex] as HTMLElement | undefined;
            if (child) {
                  child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            }
      }, [activeIndex, mediaMessages?.length]);

      if (!fullscreenImage) return null;

      if (!chat) return null;


      return (
            <div
                  className="fixed inset-0 bg-[#e21893] z-[999999] flex flex-col"
                  onClick={() => setFullscreenImage(null)}
            >
                  {/* Top Bar */}
                  <div className="flex justify-between items-center w-full mt-2 px-2">
                        <div
                              onClick={(e) => {
                                    e.stopPropagation();
                                    setFullscreenImage(null);
                              }}
                              className="text-white text-2xl p-2 cursor-pointer w-[25%]"
                        >
                              <ChevronLeft />
                        </div>
                        <div className="text-center w-[50%]">
                              <div className="font-bold! text-white">
                                    @{currentMessage.sender.username}
                              </div>
                              <div className="text-gray-400 text-[80%]">
                                    {new Date(currentMessage.createdAt).toLocaleString(undefined, {
                                          year: 'numeric',
                                          month: 'numeric',
                                          day: 'numeric',
                                          hour: 'numeric',
                                          minute: '2-digit',
                                    })}
                              </div>
                        </div>
                        <div className="w-[25%]" />
                  </div>

                  {/* Horizontal Scrollable Images */}
                  <div
                        ref={scrollContainerRef}
                        className="flex-1 overflow-x-auto flex snap-x snap-mandatory touch-pan-x"
                        onClick={(e) => e.stopPropagation()}
                        onScroll={handleScroll}
                  >
                        {mediaMessages?.map((m) => (
                              <div
                                    key={m.id}
                                    className="flex-shrink-0 w-full flex justify-center items-center snap-center"
                              >
                                    <Image
                                          src={m.mediaUrl ?? ""}
                                          alt="Fullscreen"
                                          width={850}
                                          height={850}
                                          className="max-h-[78vh] object-contain"
                                          draggable={false}
                                    />
                              </div>
                        ))}
                  </div>

                  {/* Thumbnails */}
                  <div ref={thumbsRef} className="w-full overflow-x-auto flex gap-2 p-2 pb-8 bg-[#e21893]">
                        {mediaMessages?.map((m, i) => (
                              <Image
                                    key={m.id}
                                    src={m.mediaUrl ?? ""}
                                    alt="preview"
                                    width={70}
                                    height={70}
                                    draggable={false}
                                    className={`h-16 w-16 object-cover rounded cursor-pointer transition
              ${i === activeIndex ? "ring-2 ring-white" : "opacity-60 hover:opacity-100"}`}
                                    onClick={(e) => {
                                          e.stopPropagation();
                                          setFullscreenImage({ messageObj: m, chatId: chat._id });
                                          setActiveIndex(i);
                                          if (scrollContainerRef.current) {
                                                const left = i * scrollContainerRef.current.clientWidth;
                                                scrollContainerRef.current.scrollTo({ left, behavior: 'smooth' });
                                          }
                                    }}
                              />
                        ))}
                  </div>
            </div>
      );
};

export default FullScreenImageViewer;


