import { Injectable } from '@nestjs/common';
import { CreateReasonLidDto } from './dto/create-reason_lid.dto';
import { UpdateReasonLidDto } from './dto/update-reason_lid.dto';

@Injectable()
export class ReasonLidService {
  create(createReasonLidDto: CreateReasonLidDto) {
    return 'This action adds a new reasonLid';
  }

  findAll() {
    return `This action returns all reasonLid`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reasonLid`;
  }

  update(id: number, updateReasonLidDto: UpdateReasonLidDto) {
    return `This action updates a #${id} reasonLid`;
  }

  remove(id: number) {
    return `This action removes a #${id} reasonLid`;
  }
}
