import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  DELIVERY = 'DELIVERY',
}

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true, unique: true })
  phone!: string;

  @Prop({ enum: UserRole, default: UserRole.CUSTOMER })
  role!: UserRole;

  @Prop({
    required: true,
  })
  securityQuestion?: string;

  @Prop({
    required: true,
  })
  securityAnswerHash?: string;

  @Prop({
    type: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
    },
  })
  address!: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark: string;
  };

  @Prop({ default: true })
  isActive!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
