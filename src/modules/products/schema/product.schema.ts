import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type ProductDocuments = HydratedDocument<Product>;

@Schema({ timestamps: true, collection: 'product' })
export class Product extends Document {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop()
  description!: string;

  @Prop()
  imageUrl!: string;

  @Prop()
  displayOrder!: number;

  @Prop()
  isActive!: boolean;
}

export const productSchema = SchemaFactory.createForClass(Product);
