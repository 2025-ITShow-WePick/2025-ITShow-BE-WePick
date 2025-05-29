import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Post, PostDocument } from '../schemas/post.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SavePostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
    private configService: ConfigService,
  ) {}

  // aws 서버에 저장
  async saveImage(fileName: string, file: Express.Multer.File, ext: string) {
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

  // db에 url만 저장
  async saveImageUrlToDb(imageUrl: string) {
    try {
      await this.postModel.create({ imageUrl });
    } catch (err) {
      console.error('DB에 이미지 URL 저장 실패:', err);
      throw new InternalServerErrorException(
        'DB에 이미지 URL 저장 중 오류 발생',
      );
    }
  }
}
