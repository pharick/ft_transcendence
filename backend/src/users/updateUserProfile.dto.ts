import { Length } from 'class-validator';

export class UpdateUserProfileDto {
  @Length(3, 15)
  username: string;
}
