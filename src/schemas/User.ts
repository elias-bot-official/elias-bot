import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
   _id: {
      type: String,
      required: true,
   },
   balance: {
      type: Number,
      required: true,
      default: 0
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
      required: true,
      default: new Map()
   }
}, {minimize: false});

export const User = mongoose.model('User', UserSchema);