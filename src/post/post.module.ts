import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { MongooseModule } from '@nestjs/mongoose';

// Controller
import { PostController } from './post.controller';
import { SavePostController } from './commands/save-post.controller';

// Services
import { PostService } from './post.service';
import { SavePostService } from './commands/save-post.service';
import { GetPostService } from './queries/get-post.service';
import { MapService } from './map/map.service';

// Schema
import { Post, PostSchema } from './schemas/post.schema';
import { User, UserSchema } from './schemas/user.schema';
import { Tag, TagSchema } from './schemas/tag.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
      { name: Tag.name, schema: TagSchema },
    ]),
  ],
  controllers: [PostController, SavePostController],
  providers: [
    {
      provide: 'S3_CLIENT',
      useFactory: (configService: ConfigService) => {
        const region = configService.get<string>('AWS_REGION');
        const accessKeyId = configService.get<string>('AWS_S3_ACCESS_KEY');
        const secretAccessKey = configService.get<string>(
          'AWS_S3_SECRET_ACCESS_KEY',
        );
        if (!region || !accessKeyId || !secretAccessKey) {
          throw new Error('Missing AWS configuration for S3Client');
        }

        return new S3Client({
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });
      },
      inject: [ConfigService],
    },
    PostService,
    SavePostService,
    GetPostService,
    MapService,
  ],
  exports: ['S3_CLIENT'],
})
export class PostModule {}
