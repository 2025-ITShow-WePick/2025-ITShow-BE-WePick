import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TagDocument = HydratedDocument<Tag>;

@Schema()
export class Tag {
  @Prop({ required: true, unique: true })
  tagName: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
