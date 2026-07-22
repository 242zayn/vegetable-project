import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocuments } from './schema/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    readonly productModel: Model<ProductDocuments>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const { name } = createProductDto;

    const isProductExist = await this.productModel.findOne({ name });

    if (isProductExist) {
      throw new BadGatewayException(
        'Product name is alredy exist make some unique',
      );
    }

    await this.productModel.create(createProductDto);

    return {
      message: 'Product cerated Sesssfully',
    };
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
