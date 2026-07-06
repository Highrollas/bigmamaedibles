import { IChatRoom } from "@/Interface";
import connectDBIfNoConnExist from '../libs/mongoose'
import { model, models, Schema } from "mongoose";

await connectDBIfNoConnExist();

const ChatRoomSchema = new Schema<IChatRoom>(
      {
            name: {
                  type: String,
                  required: true,
            },
            slug: {
                  type: String,
            },
            imageUrl: {
                  type: String,
            },
            description: {
                  type: String,
            },
            messages: {
                  type: [Object],
            },
            blockedMembers: {
                  type: [String],
            },
            restrictedMembers: {
                  type: [String],
            },
            memebers: {
                  type: [String],
            },
            metadata: {
                  type: Object
            },
            status: {
                  type: String,
                  enum: ["active", "inactive"],
                  default: "active"
            },
            onlyAdmins: {
                  type: Boolean,
            },
            allowPFP: {
                  type: Boolean,
            },
      }, { timestamps: true }
);


export default models.ChatRooms || model('ChatRooms', ChatRoomSchema);

