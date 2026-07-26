import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  ProductCategory,
  ProductCategoryDocuments,
} from './schema/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(ProductCategory.name)
    private readonly categoryModel: Model<ProductCategoryDocuments>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, slug, description, imageUrl, isActive } = createCategoryDto;
    const isCategoryExist = await this.categoryModel.findOne({ name });

    if (isCategoryExist) {
      throw new BadGatewayException(
        'Category name alredy exist choose some thing unique',
      );
    }

    await this.categoryModel.create({
      name,
      slug,
      description,
      imageUrl,
      isActive,
    });

    // return await this.categoryModel.create(createCategoryDto);
    return {
      message: ' Category created seccesfully',
    };
  }

  async findByIds(ids: string[]) {
    return this.categoryModel.find({
      _id: { $in: ids },
    });
  }

  findAll() {
    return this.categoryModel.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
