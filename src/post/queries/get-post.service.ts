import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostDocument, Posts } from '../schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from '../schemas/tag.schema';
import { postToGetPostsByTagDto } from '../mapper/post-to-dto.mapper';
import { GetPostsByTagDto } from '../dto/get-posts-by-tag.dto';

@Injectable()
export class GetPostService {
  constructor(
    @InjectModel(Posts.name) private postModel: Model<PostDocument>,
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
  ) {}

  async getPostsByTag(tags: string[]): Promise<GetPostsByTagDto[]> {
    try {
      // 하나라도 태그가 포함되면 검색되어야 하므로 $in 사용
      const tagNames = await this.tagModel.find({ tagName: { $in: tags } });
      const tagIds = tagNames.map((t) => t._id);

      // 해당 태그 id가 포함된 Post만 검색
      const posts = await this.postModel.find({ tags: { $in: tagIds } });

      return posts.map(postToGetPostsByTagDto);
    } catch (err) {
      console.log('태그 별 Post 조회 실패', err);
      throw new InternalServerErrorException('Post 조회 중 오류 발생');
    }
  }
}
