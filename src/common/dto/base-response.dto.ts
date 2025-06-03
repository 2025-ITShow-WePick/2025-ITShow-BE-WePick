import { HttpStatus } from '@nestjs/common';

export class BaseResponse<T> {
  status: HttpStatus;
  message: string;
  data?: T;
}
