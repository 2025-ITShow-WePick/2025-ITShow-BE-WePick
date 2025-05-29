import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { SavePostService } from './save-post.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class SavePostController {
  constructor(private readonly savePostService: SavePostService) {}

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
    @Param('postId') postId: string,
  ) {
    const ext = file.originalname.split('.').pop() as string;
    const fileName = `uploads/${postId}/${uuidv4()}.${ext}`;

    const imageUrl = await this.savePostService.saveImage(fileName, file, ext); // 이미지 url을 aws에 저장

    await this.savePostService.saveImageUrlToDb(imageUrl); // 이미지 url을 db에 저장

    return { success: true, url: imageUrl };
  }
}
