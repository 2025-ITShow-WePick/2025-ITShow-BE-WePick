import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Posts, PostDocument } from '../schemas/post.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDto } from 'src/post/dto/create-post.dto';
import { Tag, TagDocument } from '../schemas/tag.schema';
import { User, UserDocument } from '../../user/schema/user.schema';

@Injectable()
export class SavePostService {
  constructor(
    @InjectModel(Posts.name) private postModel: Model<PostDocument>,
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
    private configService: ConfigService,
  ) {}

  // post를 db에 저장
  async savePostWithTags(createPostDto: CreatePostDto): Promise<PostDocument> {
    const tagIds: Types.ObjectId[] = [];

    try {
      // 생성된 Tag 확인하고 id 저장
      for (const tag of createPostDto.tags) {
        const existingTag = await this.tagModel.findOne({ tagName: tag });

        if (existingTag) {
          tagIds.push(existingTag._id);
        } else {
          const newTag = await this.tagModel.create({ tagName: tag });
          tagIds.push(newTag._id);
        }
      }
      // 저장된 id로 post 생성
      const post = await this.postModel.create({
        ...createPostDto,
        tags: tagIds,
      });

      return post;
    } catch (err) {
      console.error('Post 저장 실패:', err);
      throw new InternalServerErrorException('Post 저장 중 오류 발생');
    }
  }

  // aws bucket에 저장
  async saveImageToS3(
    fileName: string,
    file: Express.Multer.File,
    ext: string,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Key: fileName,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: `image/${ext}`,
      });

      await this.s3Client.send(command);
      return `https://${this.configService.get('AWS_S3_BUCKET_NAME')}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${fileName}`;
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      throw new InternalServerErrorException('이미지 업로드 중 오류 발생');
    }
  }
}
