import mongoose from "mongoose";

export interface Warn {

   user_id: string;
   reason?: string;

}

const GuildSchema = new mongoose.Schema({
   _id: {
      type: String,
      required: true,
   },
   warns: {
      type: Array<Warn>,
      default: new Array()
   }
}, { minimize: false });

export const Guild = mongoose.model('Guild', GuildSchema);