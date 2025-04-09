import { model, Schema } from "mongoose";
import { User } from "./user.entity";

const userSchema = new Schema<User>({
  firstName: String,
  lastName: String,
  picture: String,
});

userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

function getProperties(ret: any) {
  
}

userSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return {
      id: ret.id,
      firstName: ret.firstName,
      lastName: ret.lastName,
      fullName: ret.fullName,
      picture: ret.picture,
    };
  }
});

userSchema.set('toObject', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return {
      id: ret.id,
      firstName: ret.firstName,
      lastName: ret.lastName,
      fullName: ret.fullName,
      picture: ret.picture,
    };
  }
});

export const UserModel = model<User>('User', userSchema);