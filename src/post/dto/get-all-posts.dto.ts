import { IsString, IsDate } from 'class-validator';

export class GetAllPostsDto {
  @IsString()
  imageUrl: string;

  @IsString()
  location: string;

  @IsDate()
  date: string;

  @IsString()
  memo: string;
}
