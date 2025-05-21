import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';

// Services
import { SavePostService } from './commands/save-post.service';
import { GetPostService } from './queries/get-post.service';
import { MapService } from './map/map.service';

@Module({
  controllers: [PostController],
  providers: [PostService, SavePostService, GetPostService, MapService],
})
export class PostModule {}
