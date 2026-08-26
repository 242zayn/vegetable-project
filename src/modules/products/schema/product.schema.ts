import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProductDocuments = HydratedDocument<Product>;

@Schema({ timestamps: true, collection: 'product' })
export class Product {
  @Prop({ required: true, unique: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, trim: true })
  slug!: string;

  @Prop()
  description!: string;

  @Prop()
  imageUrl!: string;

  @Prop()
  displayOrder!: number;

  @Prop()
  isActive!: boolean;

  @Prop({ default: null })
  deleteAt?: null | Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
  })
  categoryId?: mongoose.Types.ObjectId;
}

export const productSchema = SchemaFactory.createForClass(Product);
