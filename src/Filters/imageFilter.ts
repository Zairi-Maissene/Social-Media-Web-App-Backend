import { BadRequestException } from '@nestjs/common';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    //return callback(new Error('Only image files are allowed!'), false);
    throw new BadRequestException('Only image files are allowed!');
  }
  callback(null, true);
};
