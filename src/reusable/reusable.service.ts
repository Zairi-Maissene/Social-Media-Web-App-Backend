import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReusableDto } from './dto/create-reusable.dto';
import { UpdateReusableDto } from './dto/update-reusable.dto';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Reusable } from './entities/reusable.entity';
@Injectable()
export abstract class ReusableService<T extends Reusable> {
  constructor(private readonly repository: Repository<T>) {}

  async create(dto: CreateReusableDto): Promise<any> {
    return await this.repository.save(dto as DeepPartial<T>);
  }

  async findAll(): Promise<any> {
      return this.repository.find();

  }

  async findById(id: string): Promise<any> {
    return this.repository.findOneBy({ id: id } as FindOptionsWhere<T>);

    }

  async update(id: string, dto: UpdateReusableDto): Promise<any> {

      const entity = await this.repository.findOneBy({
        id: id,
      } as FindOptionsWhere<T>);

      Object.assign(entity, dto);
      return this.repository.save(entity);


  }

  async delete(id: string): Promise<any> {

    const result = await this.repository.delete(id);
    if (!result.affected)
      throw new NotFoundException(`L'objet  d'id ${id} n'existe pas `);

  }

  //soft delete
  async softDelete(id: string,errorMessage:string): Promise<any> {

     // if (userId == (await this.findById(id)).userId){
     const result = await this.repository.softDelete(id);
     if (result.affected) return result;
     else throw new NotFoundException(errorMessage);

  }
  //  else {
  //   throw new  UnauthorizedException();
  //  }

  async restoretodo2(id: string, userId: string) {

    const result = await this.repository.restore(id);
    if (result.affected) return result;
    else throw new NotFoundException(`L' objet  d'id ${id} n'existe pas `);
    }


}
