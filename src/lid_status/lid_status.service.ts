import { Injectable } from '@nestjs/common';
import { CreateLidStatusDto } from './dto/create-lid_status.dto';
import { UpdateLidStatusDto } from './dto/update-lid_status.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LidStatusService {
  constructor(
    private readonly prismaService: PrismaService
  ) {}

  create(createLidStatusDto: CreateLidStatusDto) {
    return this.prismaService.lid_status.create({
      data: createLidStatusDto,
    });
  }

  findAll() {
    return this.prismaService.lid_status.findMany();
  }

  findOne(id: number) {
    return this.prismaService.lid_status.findUnique({
      where: { id },
    });
  }

  update(id: number, updateLidStatusDto: UpdateLidStatusDto) {
    return this.prismaService.lid_status.update({
      where: { id },
      data: updateLidStatusDto,
    });
  }

  remove(id: number) {
    return this.prismaService.lid_status.delete({
      where: { id },
    });
  }
}
