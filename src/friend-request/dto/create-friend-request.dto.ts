import { User } from '../../user/entities/user.entity';

export class CreateFriendRequestDto {
  reciever: string;
  sender: string;
}
