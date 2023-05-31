import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { SubscribeUser } from '../user/dto/create-user.dto';

@Injectable()
export class SignupValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const dto = plainToClass(SubscribeUser, value);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints))
        .flat();
      throw new BadRequestException(errorMessages);
    }

    return value;
  }
}
