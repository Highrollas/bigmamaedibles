import { IProduct } from '@/Interface';
import { Schema, model, models } from 'mongoose';
import connectDBIfNoConnExist from '../libs/mongoose'

await connectDBIfNoConnExist();

const ProductSchema = new Schema<IProduct>(
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
            },
            shortDescription: {
                  type: String,
            },
            price: {
                  type: Number,
                  required: true,
            },
            categories: {
                  type: [String],
                  required: true,
            },
            images: {
                  type: [String],
                  default: [],
            },
            stockQty: {
                  type: Number,
                  required: true,
                  default: 0,
            },
            variations: {
                  type: [Object],
                  required: true,
                  default: [],
            },
            productType: {
                  required: true,
                  type: String,
            },
            status: {
                  required: true,
                  type: String,
                  enum: ["draft", "published"],
            },
            costPrice: {
                  type: String
            },
            lastStockUpdate: {
                  type: Date,
                  default: Date.now
            },
            metadata: {
                  type: Object,
                  required: true
            },
            viewsCount: {
                  type: Number,
                  default: 0
            },
            csort: {
                  type: Number,
                  default: 0
            }
      },
      { timestamps: true }
);

export default models.Product || model<IProduct>('Product', ProductSchema);
