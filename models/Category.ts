import { ICategory } from "@/Interface";
import connectDBIfNoConnExist from '../libs/mongoose'
import { model, models, Schema } from "mongoose";

await connectDBIfNoConnExist();

const CategorySchema = new Schema<ICategory>(
      {
            name: {
                  type: String,
                  required: true,
                  trim: true,
            },
            slug: {
                  type: String,
                  required: true,
                  unique: true,
                  lowercase: true,
            },
            description: {
                  type: String,
                  required: false,
            },
            imageUrl: {
                  type: String,
                  required: false,
            },
            metadata: {
                  type: Object,
                  required: true,
            }
      }, { timestamps: true }
);


export default models.Categories || model('Categories', CategorySchema);