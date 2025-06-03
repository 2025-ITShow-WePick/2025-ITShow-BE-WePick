import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { SavePostService } from './save-post.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from 'src/post/dto/create-post.dto';
import { BaseResponse } from 'src/common/dto/base-response.dto';
import { Posts } from 'src/post/schemas/post.schema';

@Controller('post')
export class SavePostController {
  constructor(private readonly savePostService: SavePostService) {}

  // post를 db에 저장
  @Post()
  async savePost(
    @Body() createPostDto: CreatePostDto,
  ): Promise<BaseResponse<Posts>> {
    const post = await this.savePostService.savePostWithTags(createPostDto);

    return {
      success: true,
      message: 'DB에 Post가 성공적으로 저장됨',
      data: post,
    };
  }

  // aws bucket에 사진 저장
  @Post('/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<BaseResponse<string>> {
    const ext = file.originalname.split('.').pop() as string;
    const fileName = `uploads/${uuidv4()}.${ext}`;

    const imageUrl = await this.savePostService.saveImageToS3(
      fileName,
      file,
      ext,
    ); // 이미지 url을 bucket에 저장

    return {
      success: true,
      message: 'bucket에 이미지 url이 성공적으로 저장됨',
      data: imageUrl,
    };
  }
}
