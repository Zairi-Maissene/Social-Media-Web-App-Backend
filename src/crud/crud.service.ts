import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDto, UpdateDto } from './dto/crud.dto';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { BaseEntity } from './baseentity.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export abstract class CrudService<T extends BaseEntity> {
  // @ts-ignore
  constructor(private readonly repository: Repository<T>) {}

  async create(dto: CreateDto): Promise<any> {
    return this.repository.save(dto as DeepPartial<T>);
  }

  async findAll(): Promise<any> {
    return this.repository.find();
  }

  async findById(id: string): Promise<any> {
    return this.repository.findOneBy({ id: id } as FindOptionsWhere<T>);
  }

  async update(id: string, dto: UpdateDto): Promise<T> {
    const entity = await this.repository.findOneBy({
      id: id,
    } as FindOptionsWhere<T>);
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
