import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import asyncForEach = require('../utils/async_foreach');
import storage = require('../utils/cloud_storage');

@Injectable()
export class PostsService {

  constructor(@InjectRepository(Post) private postRepository: Repository<Post>){}

  async create(files: Array<Express.Multer.File>, post: CreatePostDto){

    if(files.length === 0){
        throw new HttpException("Las imagenes son obligatorias", HttpStatus.NOT_FOUND)
    }

    let uploadedFiles = 0; 

    const newPost = this.postRepository.create(post)
    const savedPost = await this.postRepository.save(post)

    const startForEach = async () => {
        await asyncForEach(files, async(file: Express.Multer.File) => {
            const url = await storage(file, file.originalname);

            if(url !== undefined && url !== null){
                if(uploadedFiles === 0){
                  savedPost.image1 = url
                }else if(uploadedFiles === 1){
                  savedPost.image2 = url
                }else if(uploadedFiles === 2){
                  savedPost.image3 = url
                }
            }   
            

            await this.update(savedPost.id, savedPost)
            uploadedFiles = uploadedFiles + 1;

        })
    }
    await startForEach();
    return savedPost;

}

  findAll() {
    return this.postRepository.find();
  }

  findByCategory(id_category: number){
    return this.postRepository.findBy({id_category: id_category});
}

  async update(id: number, post: UpdatePostDto) {
    const postFound = await this.postRepository.findOneBy({id: id});

        if(!postFound){
            throw new HttpException("Producto no encontrado", HttpStatus.NOT_FOUND);
        }

        const updatedPost = Object.assign(postFound, post);
        return this.postRepository.save(updatedPost)
  }

  async updateWithImage(files: Array<Express.Multer.File>, id: number ,post: UpdatePostDto){

    if(files.length === 0){
        throw new HttpException("Las imagenes son obligatorias", HttpStatus.NOT_FOUND)
    }

    let counter = 0;
    let uploadedFiles = Number(post.images_to_update[counter]); 

    const updatedPost =  await this.update(id, post);

    const startForEach = async () => {
        await asyncForEach(files, async(file: Express.Multer.File) => {
            const url = await storage(file, file.originalname);

            if(url !== undefined && url !== null){
                if(uploadedFiles === 0){
                  updatedPost.image1 = url
                }else if(uploadedFiles === 1){
                  updatedPost.image2 = url
                }else if(uploadedFiles === 2){
                  updatedPost.image3 = url
                }
            }

            await this.update(updatedPost.id, updatedPost)
            counter++;
            uploadedFiles = Number(post.images_to_update[counter]);
        })
    }
    await startForEach();
    return updatedPost;

}

  async delete(id: number){

    const productFound = await this.postRepository.findOneBy({id: id});
    if(!productFound){
        throw new HttpException("Post no encontrado", HttpStatus.NOT_FOUND);
    }

    return this.postRepository.delete(id)
}
}
