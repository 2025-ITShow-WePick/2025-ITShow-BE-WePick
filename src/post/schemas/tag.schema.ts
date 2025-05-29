import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Tag>;

@Schema()
export class Tag {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  tagName: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
