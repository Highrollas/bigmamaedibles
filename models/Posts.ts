import { IPost } from "@/Interface";
import connectDBIfNoConnExist from '../libs/mongoose'
import { model, models, Schema } from "mongoose";

await connectDBIfNoConnExist();

const PostSchema = new Schema<IPost>(
      {
            title: {
                  type: String,
                  required: true,
            },
            slug: {
                  type: String,
            },
            content: {
                  type: String,
            },
            viewsCount: {
                  type: Number,
            },
            metadata: {
                  type: Object
            },
            type: {
                  type: String,
                  enum: ["post", "blog"],
                  default: "post"
            },
            creatorId: {
                  type: String
            },
            status: {
                  type: String,
                  enum: ["published", "draft"],
                  default: "published"
            },
            coverImage: {
                  type: String
            }
      }, { timestamps: true }
);


export default models.Posts || model('Posts', PostSchema);