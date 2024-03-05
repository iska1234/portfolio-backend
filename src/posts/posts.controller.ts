import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Post,
  UploadedFile,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files[]', 3))
  create(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
    @Body() post: CreatePostDto,
  ) {
    return this.postsService.create(files, post);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('category/:id_category')
  findByCategory(@Param('id_category', ParseIntPipe) id_category: number) {
    return this.postsService.findByCategory(id_category);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() post: UpdatePostDto,
  ) {
    return this.postsService.update(id, post);
  }


  @Put('upload/:id')
  @UseInterceptors(FilesInterceptor('files[]', 3))
  updateWithImage(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
    @Param('id', ParseIntPipe) id: number,
    @Body() product: UpdatePostDto,
  ) {
    return this.postsService.updateWithImage(files, id, product);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
