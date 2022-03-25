import { Document} from 'mongoose';

export interface User extends Document {
    name: string;
    email: string;
    photo?: string;
    role: "user" | "admin";
    password: string | undefined;
    passwordConfirm: string | undefined;
    passwordChangedAt?: Date | undefined;
    passwordResetToken?: string;
    passwordResetExpires?: Date | undefined;
    active: boolean;
    correctPassword(candidatePassword : string,
      password: string): Promise<boolean>;
    changedPasswordAfter(): boolean;
    createPasswordResetToken(): string;
  }
