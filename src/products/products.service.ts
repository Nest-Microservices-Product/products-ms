import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skipResults = (page - 1) * limit;
    const totalRows = await this.product.count();
    const lastPage = Math.ceil(totalRows / limit);
    const dataRes = await this.product.findMany({
      where: {
        isAvailable: true,
      },
      skip: skipResults,
      take: limit,
    });
    console.log(dataRes.length);
    if (!dataRes.length) {
      throw new RpcException({
        message: 'No results found',
        status: HttpStatus.NO_CONTENT,
      });
    }
    return {
      data: dataRes,
      meta: {
        totalRows: totalRows,
        lastPage: lastPage,
        actualPage: page,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, isAvailable: true },
    });
    if (!product) {
      throw new RpcException({
        message: `Could not find product ${id}`,
        status: HttpStatus.NOT_FOUND,
      });
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _, ...data } = updateProductDto;
    await this.findOne(id);
    return this.product.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    const productDeleted = await this.product.update({
      where: { id },
      data: {
        isAvailable: false,
      },
    });
    return productDeleted;
  }
}
