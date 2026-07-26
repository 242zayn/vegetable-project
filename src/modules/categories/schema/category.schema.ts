import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type ProductCategoryDocuments = HydratedDocument<ProductCategory>;
@Schema({ timestamps: true, collection: 'categories' })
export class ProductCategory extends Document {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop()
  description?: string;

  @Prop()
  imageUrl?: string;

  @Prop({ required: true, default: false })
  isActive!: boolean;
}

export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);
