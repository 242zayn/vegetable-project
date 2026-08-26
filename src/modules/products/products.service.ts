import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CategoriesService } from '../categories/categories.service';
import {
  ProductCategory,
  ProductCategoryDocuments,
} from '../categories/schema/category.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationQueryDto } from './dto/pagination.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocuments } from './schema/product.schema';
interface MatchStage {
  $or?: Array<{ [key: string]: any }>;
  [key: string]: any;
}

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

    // Product name or slug already exists
    const existingProduct = await this.productModel.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingProduct) {
      throw new ConflictException('Product name or slug already exists');
    }

    const isCategory = await this.categoryModel.exists({
      _id: categoryId,
    });

    if (!isCategory) {
      throw new BadRequestException('Invalid category ID');
    }

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

  async findAll(query: PaginationQueryDto) {
    const { limit, page, search } = query;
    const skip = (page - 1) * limit;
    const total = await this.productModel.countDocuments();
    const matchStage: MatchStage = {};
    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    const res = await this.productModel.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'categories',
        },
      },
      {
        $unwind: '$categories',
      },
      {
        $project: {
          __v: 0,
        },
      },
      {
        $match: matchStage,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
    return {
      message: 'successfully fetched datasssssssss',
      data: res,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productModel.aggregate([
      // stage 1 match
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      // populate category data
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'categoryDeteils',
        },
      },
      { $unwind: '$categoryDeteils' },
      // Project the feild
      {
        $project: {
          categoryId: 0,
          __v: 0,
          'categoryDeteils.__v': 0,
        },
      },
    ]);
    return product[0] as ProductDocuments;
    // return this.productModel.findById(id);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      {
        deleteAt: new Date(),
      },
      {
        new: true,
      },
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.deleteAt == null) {
      throw new NotFoundException('Product alredy deleted');
    }
    return {
      message: 'Product deletd sussesfully ',
      data: product,
    };
  }

  async restore(id: string) {
    const product = await this.productModel.findByIdAndUpdate(id, {
      updateAt: null,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.deleteAt !== null) {
      throw new NotFoundException('Product alredy restored');
    }
    return {
      message: 'Product sussesfully restored',
      data: product,
    };
  }
}
