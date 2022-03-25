import mongoose from 'mongoose'
import { User } from '../@types/models/User'
import validator from 'validator'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import {Document, Query} from 'mongoose';

const UserSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name"]
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email "]
    },
    photo: {
      type: String,
      default: "default.jpg"
    },
    role: {
      type: String,
      default: "user"
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      enum: ["user", "guid", "lead-guide", "admin"],
      minlength: [8, "Please provide a min 8 characters"],
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm password"],
      validate: {
        validator: function(el:any) {
          // @ts-ignore
          const thisTyped: any = this as any;
          return el === thisTyped.password;
        },
        message: "Passwords are not the same"
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Managing Passwords
UserSchema.pre<User>("save", async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password as string, 12);

  //Delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

// Update changedPasswordAt property for user using presave hock
UserSchema.pre<User>("save", async function(next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  this.passwordChangedAt =new Date( Date.now() - 1000);
  next();
});

// Instance method for Checking if the current user is active
UserSchema.pre<Query<any, Document<User>>>(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

// Instance method for checking the input password is correct
UserSchema.methods.correctPassword = async function(
  candidatePassword : string,
  password: string
) {
  return await bcrypt.compare(candidatePassword, password);
};

UserSchema.methods.changedPasswordAfter = function(JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp =  this.passwordChangedAt.getTime() / 1000

    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT Changed
  return false;
};

UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};


export default mongoose.model("User", UserSchema);
