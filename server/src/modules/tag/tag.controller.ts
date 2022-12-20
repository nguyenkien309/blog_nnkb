import { TagEntity } from 'src/modules/tag/entities/tag.entity';
import { EntityId } from 'typeorm/repository/EntityId';
import { Entity } from 'typeorm';
import { TagService } from './tag.service';
import { Controller, Param, UseGuards, Body, Post, Get, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { createTagDto } from './dto/create-tag.dto';
import { BaseResponseDto } from 'src/base/base.dto';

@Controller('v1/tag')
@UseGuards(JwtAuthGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAllTag() {
    return this.tagService.findAllTag();
  }

  @Get(':id')
  async findTag(@Param('id') id) {
    return this.tagService.findTag(id);
  }

  @Post()
  async createTag(@Body() createTagDto: createTagDto) {
    return this.tagService.createTag(createTagDto);
  }

  @Delete(':id')
  async deleteTag(@Param('id') id) {
    return this.tagService.deleteTag(id);
  }
}
