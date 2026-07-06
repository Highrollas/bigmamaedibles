import { model, models, Schema } from "mongoose";

export interface CounterObj extends Document {
      _id: string;
      seq: number;
}

const CounterSchema = new Schema<CounterObj>({
      _id: { type: String, required: true },
      seq: { type: Number, default: 32000 },
});

// Avoid overwrite model issue in dev
const Counter = models.Counter || model<CounterObj>('Counter', CounterSchema);

export default Counter;
