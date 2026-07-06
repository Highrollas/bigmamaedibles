/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAdminFromSession, getUserFromSession } from "@/app/Helper/server";
import ChatRoom from "@/models/ChatRoom"
import { NextRequest, NextResponse } from "next/server";
import Ably from 'ably'
import { ChatMessage, ChatObj } from "@/Interface";

export const fetchChats = async () => {

      const user = await getUserFromSession();

      const admin = await getAdminFromSession();

      if (!user && !admin) {
            return NextResponse.json({
                  status: "failed",
                  message: "Your are not authorized to access this feature"
            }, { status: 401 });
      }

      const chats = await ChatRoom.find({ status: "active" }).lean();

      return NextResponse.json({
            status: "success",
            chats
      })

}


export const sendMessage = async (req: NextRequest) => {
      try {
            const { chatId, id, message, type = "text", mediaUrl = "", replyTo } = await req.json();

            const normalizedType = type === "media" ? "media" : "text";
            const trimmedMessage = typeof message === "string" ? message.trim() : "";

            if (!chatId || !id) {
                  return NextResponse.json(
                        { status: "failed", message: "chatId and id are required" },
                        { status: 400 }
                  );
            }

            if (normalizedType === "text" && !trimmedMessage) {
                  return NextResponse.json(
                        { status: "failed", message: "Text message cannot be empty" },
                        { status: 400 }
                  );
            }

            if (normalizedType === "media" && !mediaUrl?.trim()) {
                  return NextResponse.json(
                        { status: "failed", message: "Media URL is required" },
                        { status: 400 }
                  );
            }

            // 🔑 Auth: user or admin
            const user = await getUserFromSession();
            const admin = await getAdminFromSession();
            if (!user && !admin) {
                  return NextResponse.json(
                        { status: "failed", message: "You are not authorized to send messages" },
                        { status: 401 }
                  );
            }

            // ✅ Validate chat + onlyAdmins flag
            const chatDoc = await ChatRoom.findById(chatId).lean<ChatObj>();
            if (!chatDoc) {
                  return NextResponse.json(
                        { status: "failed", message: "Chat not found" },
                        { status: 404 }
                  );
            }

            if (chatDoc.onlyAdmins && !admin) {
                  return NextResponse.json(
                        { status: "failed", message: "Only admins can send to this room" },
                        { status: 403 }
                  );
            }

            const now = new Date().toISOString();
            const chatMessage: ChatMessage = {
                  id,
                  message: trimmedMessage,
                  type: normalizedType,
                  mediaUrl,
                  createdAt: now,
                  updatedAt: now,
                  status: "active",
                  sender: {
                        username: user ? user.username : admin!.username,
                        role: user ? "user" : "admin",
                        avatar: user!.avatar
                  },
                  state: "sent",
                  ...(replyTo ? { replyTo } : {}),
            };

            await ChatRoom.findByIdAndUpdate(
                  chatId,
                  { $push: { messages: chatMessage } },
                  { new: false }
            );

            //Broadcast
            const ably = new Ably.Rest(process.env.ABLY_API_KEY!);
            const channel = ably.channels.get(`chat:${chatId}`);
            await channel.publish("message", chatMessage);

            return NextResponse.json({
                  status: "success",
                  message: "Message sent",
                  messageObj: chatMessage,
            });

      } catch (err: any) {
            console.error("sendMessage error:", err);
            return NextResponse.json(
                  { status: "failed", message: "Internal server error" },
                  { status: 500 }
            );
      }
};

