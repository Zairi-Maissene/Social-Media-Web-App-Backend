import { PartialType } from '@nestjs/mapped-types';
import { CreateReusableDto } from './create-reusable.dto';

export class UpdateReusableDto extends PartialType(CreateReusableDto) {}
