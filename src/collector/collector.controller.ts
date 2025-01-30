import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CollectorService } from './collector.service';
import { CreateCollectorDto } from './dto/create-collector.dto';
import { UpdateCollectorDto } from './dto/update-collector.dto';

@ApiTags('Collector') // Adds tag grouping in Swagger
@Controller('collector')
export class CollectorController {
  constructor(private readonly collectorService: CollectorService) {}

  @ApiOperation({ summary: 'Create a collector profile' })
  @ApiResponse({
    status: 201,
    description: 'Collector profile created successfully',
  })
  @Post()
  createCollector(@Body() dto: CreateCollectorDto) {
    return this.collectorService.createCollector(dto);
  }

  @ApiOperation({ summary: 'Retrieve all collector profiles' })
  @ApiResponse({ status: 200, description: 'List of collector profiles' })
  @Get()
  getAllCollectors() {
    return this.collectorService.getAllCollectors();
  }

  @ApiOperation({ summary: 'Retrieve a collector profile by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID of the collector profile',
  })
  @ApiResponse({ status: 200, description: 'Collector profile found' })
  @ApiResponse({ status: 404, description: 'Collector profile not found' })
  @Get(':id')
  getCollectorById(@Param('id', ParseUUIDPipe) id: string) {
    return this.collectorService.getCollectorById(id);
  }

  @ApiOperation({ summary: 'Update a collector profile' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID of the collector profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Collector profile updated successfully',
  })
  @Put(':id')
  updateCollector(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCollectorDto,
  ) {
    return this.collectorService.updateCollector(id, dto);
  }

  @ApiOperation({ summary: 'Delete a collector profile' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID of the collector profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Collector profile deleted successfully',
  })
  @Delete(':id')
  deleteCollector(@Param('id', ParseUUIDPipe) id: string) {
    return this.collectorService.deleteCollector(id);
  }
}
