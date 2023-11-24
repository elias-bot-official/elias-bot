import mongoose from "mongoose";

export interface Item {

   name: string,
   amount: number

}

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
      beg: {
         type: Number
      },
      daily: {
         type: Number
      }
   },
   inventory: {
      type: Array<Item>
   }
});

export const User = mongoose.model('User', UserSchema);