import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<User>;

@Schema()
class User {
  @Prop()
  userName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
