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
      lock: {
         type: Number
      },
      lockpick: {
         type: Number
      }
   }
});

export const User = mongoose.model('User', UserSchema);