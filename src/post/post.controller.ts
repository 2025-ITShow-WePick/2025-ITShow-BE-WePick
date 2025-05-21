import { Controller, Param, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { SavePostService } from './commands/save-post.service';
import { MapService } from './map/map.service';
import { GetPostService } from './queries/get-post.service';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly savePostService: SavePostService,
    private readonly mapService: MapService,
    private readonly getPostService: GetPostService,
  ) {}

  /*
  // TODO: 전체 api에 dto 생성해서 return type 작성하기

  // 전체 게시물 조회
  @Get('')
  getAllPosts() {
    return this.getPostService.getAllPosts();
  }

  // 태그 별로 게시물 조회
  @Get('tag')
  getPostsByTag(@Query('tag') tag: string) {
    return this.getPostService.getPostsByTag(tag);
  }

  // 각 게시물 조회
  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.getPostService.getPostById(id);
  }

  // 게시물 저장 (map 위치 포함)
  @Post('')
  savePost(@Body() ) {
    return this.postService.savePost();
  }

  // map으로 위치 불러오기
  // TODO : 기능 개발 시 수정
  @Get('map')
  getMap() {
    return this.mapService.getMap();
  }

  // 사진 저장
  @Post('upload-image')
  saveImage(@Body() image: string) {
    return this.savePostService.saveImage(string);
  } */
}
