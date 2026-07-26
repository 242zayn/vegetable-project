import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

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

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'categories' }],
  })
  categoryIds?: mongoose.Types.ObjectId[];
}

export const productSchema = SchemaFactory.createForClass(Product);
