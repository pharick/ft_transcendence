import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class DisplayNameValidator implements PipeTransform {
  transform(value: any) {
    const regexp = /^[A-Za-z0-9]{3,10}$/;
    if (regexp.test(value['nickname']) == false)
      throw new BadRequestException();
    return value;
  }
}
