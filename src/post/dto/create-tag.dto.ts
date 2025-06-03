import { IsArray, IsString } from 'class-validator';

export class CrateTagDto {
  @IsArray()
  @IsString({ each: true })
  tagName: string[];
}
