import { IsString } from 'class-validator';

export class GetPostsByTagDto {
  @IsString()
  id: string;

  @IsString()
  imageUrl: string;

  @IsString()
  location: string;

  @IsString()
  date: string;

  @IsString()
  memo: string;
}
