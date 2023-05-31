import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import {UpdateUserDto} from "../user/dto/update-user.dto";

@Injectable()
export class UpdateUserValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        if (value === undefined) {


            throw new BadRequestException('Invalid request payload');
        }
        const dto = plainToClass(UpdateUserDto, value);
        const errors = await validate(dto);

        if (errors.length > 0) {
            const errorMessages = errors.map(error => Object.values(error.constraints)).flat();
            throw new BadRequestException(errorMessages);
        }

        return value;
    }
}