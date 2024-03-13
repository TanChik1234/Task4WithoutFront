import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePeopleDto } from 'dto/createPeople.dto';
import { DatabaseService } from 'src/modules/database/database.service';
import { People } from 'src/entities/people.entity';
import { FileService } from '../file/file.service';


@Injectable()
export class PeopleService {
  constructor(
    private databaseService: DatabaseService,
    private fileService: FileService
  ){}


  async create(createPeopleDto: CreatePeopleDto){
    let response = await this.databaseService.createEntity(createPeopleDto, 'People') as People;
    return this.editResponse(response);
  }
  async getAll(){
    let response = await this.databaseService.getAll('People');
    return response.map(elem => this.editResponse(elem as People));
  }

  async getSpecificPage(numberPage: number){
    let response = await this.databaseService.getSpecificPage('People', numberPage);
    return response.map(elem => this.editResponse(elem as People));
  }

  async getById(id:number){
    let response = await this.databaseService.getById('People', id)
    return this.editResponse(response as People);
  }

  async update(id:number, createPeopleDto: CreatePeopleDto){
    let response = await this.databaseService.updateEntity(id,createPeopleDto,'People');
    return this.editResponse(response as People);
  }

  async delete(id:number){
    let response = await this.databaseService.deleteEntity(id, 'People');
    return this.editResponse(response as People);
  }

  async addImages(images: Express.Multer.File[], id:number){
    let imagesName: string[] = [];
    images.forEach(image => {
      imagesName.push(image.filename);
    });
    try {
      await this.databaseService.uploadImages(imagesName, id, 'People');
      return {imagesName: imagesName}
    } catch (error) {
      
      throw new HttpException('No image file uploaded', HttpStatus.BAD_REQUEST);
    }
  }


  async getAllImages(id:number){
    let images = await this.databaseService.getAllImages(id, 'People');
    return images?.map(image => {return {id: image.id, name: image.name}})
  }

  async getImageNameById(personId: number, imageId: number){
    let image = await this.databaseService.getImageNameById(personId, 'People', imageId)
    return {imageName: image, imageType: this.getImageType(image)};
  }

  async deleteImage(peopleId: number, imageId: number){
    let image = await this.databaseService.deleteImageById(peopleId, 'People', imageId);
    await this.fileService.deleteImage(image.name);
    return image;
  }

  /**
   * Method for editing people data to be sent in response to the user.
   * @param response the people data to be edited
   * @returns the edited data
   */
  editResponse(response: People){
    let person = {
      id: response.id,
      name: response.name,
      height: response.height,
      mass: response.mass,
      hair_color: response.hair_color,
      skin_color: response.skin_color,
      eye_color:response.eye_color,
      birth_year: response.birth_year,
      gender: response.gender,
      homeworld: response.homeworld?.url,
      films: response.films?.map(elem => elem.url),
      species: response.species?.map(elem => elem.url),
      vehicles: response.vehicles?.map(elem => elem.url),
      starships: response.starships?.map(elem => elem.url),
      images: response.images?.map(elem => elem.name),
      created: response.created,
      edited: response.edited,
      url: response.url
    }
    return person;
  }

  getImageType(imagePath?: string) {
    if (!imagePath) {
      return 'jpeg';
    }
    const parts = imagePath.split('.');
    if (parts.length < 2) {
      return 'jpeg';
    }
    const extension = parts[parts.length - 1].toLowerCase();
    if (extension === 'jpg' || extension === 'jpeg') {
      return 'jpeg';
    } else if (extension === 'png') {
      return 'png';
    } else if (extension === 'gif') {
      return 'gif';
    } else {
      return 'jpeg';
    }
  }
}
