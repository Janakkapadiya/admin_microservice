import { Injectable } from '@nestjs/common';

@Injectable()
export class ConsumerService {
  get() {
    return 'Hello World!';
  }
}
