import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minlength: 3,
    maxlength: 50,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({ type: String, default: null })
  refreshToken: string;

  @Prop({
    type: String,
    required: true,
    minlength: 1,
    maxlength: 20,
    trim: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
    minlength: 1,
    maxlength: 20,
    trim: true,
  })
  lastName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UsersDocument = User & Document & { _id: string };
