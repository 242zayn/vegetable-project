import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from '../categories/categories.service';
import {
  ProductCategory,
  ProductCategoryDocuments,
} from '../categories/schema/category.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { Product, ProductDocuments } from './schema/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    readonly productModel: Model<ProductDocuments>,
    @InjectModel(ProductCategory.name)
    private readonly categoryModel: Model<ProductCategoryDocuments>,
    readonly productCategoryservices: CategoriesService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const { name, slug, categoryIds } = createProductDto;

    // Duplicate category IDs
    const uniqueCategoryIds = [...new Set(categoryIds)];

    if (uniqueCategoryIds.length !== categoryIds.length) {
      throw new BadRequestException('Duplicate category IDs are not allowed');
    }

    // Product name or slug already exists
    const existingProduct = await this.productModel.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingProduct) {
      throw new ConflictException('Product name or slug already exists');
    }

    // Check category existence
    const categories = await this.categoryModel.find({
      _id: { $in: uniqueCategoryIds },
    });

    if (categories.length !== uniqueCategoryIds.length) {
      throw new BadRequestException('One or more category IDs are invalid');
    }

    // Create product
    const product = await this.productModel.create({
      ...createProductDto,
      categoryIds: uniqueCategoryIds,
    });

    return {
      message: 'Product created successfully',
      data: product,
    };
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
