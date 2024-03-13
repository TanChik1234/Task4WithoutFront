import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStarshipDto } from 'dto/createStarship.dto';
import { DatabaseService } from 'src/modules/database/database.service';
import { Starships } from 'src/entities/starships.entity';
import { FileService } from 'src/modules/file/file.service';


@Injectable()
export class StarshipsService {
  constructor(
    private databaseService: DatabaseService,
    private fileService: FileService
  ){}


  async create(createStarshipDto: CreateStarshipDto){
    let response = await this.databaseService.createEntity(createStarshipDto, 'Starships');
    return this.editResponse(response);
  }
  async getAll(){
    let response = await this.databaseService.getAll('Starships');
    return response.map(elem => this.editResponse(elem));
  }
  async getSpecificPage(numberPage: number){
    let response = await this.databaseService.getSpecificPage('Starships', numberPage);
    return response.map(elem => this.editResponse(elem));
  }

  async getById(id:number){
    let response = await this.databaseService.getById('Starships', id)
    return this.editResponse(response);
  }

  async update(id:number, createStarshipDto: CreateStarshipDto){
    let response = await this.databaseService.updateEntity(id,createStarshipDto,'Starships');
    return this.editResponse(response);
  }

  async delete(id:number){
    let response = await this.databaseService.deleteEntity(id, 'Starships');
    return this.editResponse(response);
  }

  async addImages(images: Express.Multer.File[], id:number){
    let imagesName: string[] = [];
    images.forEach(image => {
      imagesName.push(image.filename);
    });
    try {
      await this.databaseService.uploadImages(imagesName, id, 'Starships');
      return {
        imagesName: imagesName
      }
    } catch (error) {
      throw new HttpException('No image file uploaded', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllImages(id:number){
    let images = await this.databaseService.getAllImages(id, 'Starships');
    return images?.map(image => {return {id: image.id, name: image.name}})
  }

  async getImageNameById(starshipId: number, imageId: number){
    let image = await this.databaseService.getImageNameById(starshipId, 'Starships', imageId)
    return {imageName: image, imageType: this.getImageType(image)};
  }

  async deleteImage(starshipId: number, imageId: number){
    let image = await this.databaseService.deleteImageById(starshipId, 'Starships', imageId);
    await this.fileService.deleteImage(image.name);
    return image;
  }

  /**
   * Method for editing starship data to be sent in response to the user.
   * @param response  the starship data to be edited
   * @returns  the edited data
   */
  editResponse(response: Starships){
    let starship = {
      id: response.id,
      name: response.name,
      model: response.model,
      manufacturer: response.manufacturer,
      cost_in_credits: response.cost_in_credits,
      length: response.length,
      max_atmosphering_speed:response.max_atmosphering_speed,
      crew: response.crew,
      passengers: response.passengers,
      cargo_capacity: response.cargo_capacity,
      consumables: response.consumables,
      hyperdrive_rating: response.hyperdrive_rating,
      MGLT: response.MGLT,
      starship_class:response.starship_class,
      pilots: response.pilots?.map(elem => elem.url),
      films: response.films?.map(elem => elem.url),
      images: response.images?.map(elem => elem.name),
      created: response.created,
      edited: response.edited,
      url: response.url
    }
    return starship;
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
