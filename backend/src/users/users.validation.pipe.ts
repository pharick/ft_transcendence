import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';


@Injectable()
export class MaxFileSizeValidator implements PipeTransform {
  constructor(private maxSize: any) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value != undefined) {
      if (value.size <= this.maxSize) return value;
    }
    throw new BadRequestException();
  }
}

@Injectable()
export class FileTypeValidator implements PipeTransform {
  constructor(private fileType: any) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const res = this.fileType.filter(type => type == value.mimetype)
    if (res.length == 0) throw new BadRequestException();
    return value;
  }
}

@Injectable()
export class DisplayNameValidator implements PipeTransform {
  constructor() {}

  transform(value: any, metadata: ArgumentMetadata) {
    const regexp: RegExp = /^[A-Za-z0-9]{3,10}$/
    if (regexp.test(value['nickname']) == false) throw new BadRequestException();
    return value;
  }
}
