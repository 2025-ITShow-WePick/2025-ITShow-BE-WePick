import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SavePostService } from './commands/save-post.service';
import { MapService } from './map/map.service';
import { GetPostService } from './queries/get-post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { BaseResponse } from 'src/common/dto/base-response.dto';
import { Posts } from './schemas/post.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 } from 'uuid';
import { GetPostsByTagDto } from './dto/get-posts-by-tag.dto';

@Controller('post')
export class PostController {
  constructor(
    private readonly savePostService: SavePostService,
    private readonly mapService: MapService,
    private readonly getPostService: GetPostService,
  ) {}

  // TODO: 각 기능 별 Service를 여기서 한번에 주입, 매핑

  // 전체 게시물 조회
  @Get()
  async getAllPosts() {
    const posts = await this.getPostService.getAllPosts();

    return {
      status: HttpStatus.OK,
      message: '모든 Post 조회 성공',
      data: posts,
    };
  }

  // 태그 별로 게시물 조회
  @Get('tag')
  async getPostsByTag(
    @Query('tags') tags: string[],
  ): Promise<BaseResponse<GetPostsByTagDto[]>> {
    const posts = await this.getPostService.getPostsByTag(tags);

    return {
      status: HttpStatus.OK,
      message: '태그 별 Post 조회 성공',
      data: posts,
    };
  }

  // 각 게시물 조회
  // @Get(':id')
  // getPostById(@Param('id') id: string) {
  //   return this.getPostService.getPostById(id);
  // }

  // 게시물 저장 (map 위치 포함)
  @Post()
  async savePost(
    @Body() createPostDto: CreatePostDto,
  ): Promise<BaseResponse<Posts>> {
    const post = await this.savePostService.savePostWithTags(createPostDto);

    return {
      status: HttpStatus.CREATED,
      message: 'DB에 Post가 성공적으로 저장됨',
      data: post,
    };
  }

  // map으로 위치 불러오기
  // TODO : 기능 개발 시 수정
  // @Get('map')
  // getMap() {
  //   return this.mapService.getMap();
  // }

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
    const fileName = `uploads/${v4()}.${ext}`;

    const imageUrl = await this.savePostService.saveImageToS3(
      fileName,
      file,
      ext,
    ); // 이미지 url을 bucket에 저장

    return {
      status: HttpStatus.OK,
      message: 'bucket에 이미지 url이 성공적으로 저장됨',
      data: imageUrl,
    };
  }
}
