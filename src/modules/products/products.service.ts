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
    const { name, slug, categoryId } = createProductDto;
    console.log(createProductDto);

    // Product name or slug already exists
    const existingProduct = await this.productModel.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingProduct) {
      throw new ConflictException('Product name or slug already exists');
    }
    console.log('categoryId', categoryId);

    const isCategory = await this.categoryModel.exists({
      _id: categoryId,
    });

    if (!isCategory) {
      throw new BadRequestException('Invalid category ID');
    }

    console.log('isCategory', isCategory);

    // Create product
    const product = await this.productModel.create({
      ...createProductDto,
      // categoryId: categoryId,
    });

    return {
      message: 'Product created successfully',
      data: product,
    };
  }

  async findAll() {
    const res = await this.productModel.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'categories',
        },
      },
    ]);
    return {
      message: 'succesfyll feched data',
      data: res,
    };
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
