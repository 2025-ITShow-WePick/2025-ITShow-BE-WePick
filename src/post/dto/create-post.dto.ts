import { IsArray, IsNotEmpty, IsString, IsDate } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  user: string;

  @IsString()
  imageUrl: string;

  @IsString()
  location: string;

  @IsDate()
  date: string;

  @IsString()
  memo: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
