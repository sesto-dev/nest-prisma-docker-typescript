import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectorDto } from './dto/create-collector.dto';
import { UpdateCollectorDto } from './dto/update-collector.dto';

@Injectable()
export class CollectorService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCollector(dto: CreateCollectorDto) {
    return this.prismaService.collector.create({
      data: dto,
    });
  }

  async getCollectorById(id: string) {
    const collector = await this.prismaService.collector.findUnique({
      where: { id },
      include: {
        user: true,
        purchases: true,
      },
    });
    if (!collector) {
      throw new NotFoundException('Collector profile not found');
    }
    return collector;
  }

  async updateCollector(id: string, dto: UpdateCollectorDto) {
    const collector = await this.prismaService.collector.findUnique({
      where: { id },
    });
    if (!collector) {
      throw new NotFoundException('Collector profile not found');
    }
    return this.prismaService.collector.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCollector(id: string) {
    const collector = await this.prismaService.collector.findUnique({
      where: { id },
    });
    if (!collector) {
      throw new NotFoundException('Collector profile not found');
    }
    return this.prismaService.collector.delete({
      where: { id },
    });
  }

  async getAllCollectors() {
    return this.prismaService.collector.findMany({
      include: {
        user: true,
        purchases: true,
      },
    });
  }
}
