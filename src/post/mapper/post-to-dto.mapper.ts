import { GetPostsByTagDto } from '../dto/get-posts-by-tag.dto';
import { PostDocument } from '../schemas/post.schema';

export function postToGetPostsByTagDto(post: PostDocument): GetPostsByTagDto {
  return {
    imageUrl: post.imageUrl,
    location: post.location,
    date: post.date.toString(),
    memo: post.memo,
  };
}
