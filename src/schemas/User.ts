import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
   _id: {
      type: String,
      required: true,
   },
   balance: {
      type: Number,
      required: true
   },
   cooldowns: {
      daily: {
         type: Number
      },
      work: {
         type: Number
      },
      beg: {
         type: Number
      },
      search: {
         type: Number
      }
   },
   inventory: {
      type: Map<string, number>,
      required: true
   }
});

export const User = mongoose.model('User', UserSchema);
export const defaultUser = {balance: 0, cooldowns: {}, inventory: {}};