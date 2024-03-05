import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category) private categoriesRepository: Repository<Category>
){}
  create(category: CreateCategoryDto) {
    const newCategory = this.categoriesRepository.create(category)
    return this.categoriesRepository.save(newCategory);
  }

  findAll(){
    return this.categoriesRepository.find()
}

async update(id: number, category: UpdateCategoryDto){

  const categoryFound = await this.categoriesRepository.findOneBy({id: id});
  
  if(!categoryFound){
      throw new HttpException('La categoria no existe', HttpStatus.NOT_FOUND);
  }

  const updatedCategory = Object.assign(categoryFound, category);
  return this.categoriesRepository.save(updatedCategory);

}

  async delete(id: number){
        
    const categoryFound = await this.categoriesRepository.findOneBy({id: id});
    if(!categoryFound){
        throw new HttpException('La categoria no existe', HttpStatus.NOT_FOUND);
    }

    return this.categoriesRepository.delete(id);
}
}
