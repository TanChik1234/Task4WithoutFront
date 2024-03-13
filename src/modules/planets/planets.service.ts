import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePlanetDto } from 'dto/createPlanet.dto';
import { DatabaseService } from 'src/modules/database/database.service';
import { Planets } from 'src/entities/planets.entity';
import { FileService } from 'src/modules/file/file.service';


@Injectable()
export class PlanetsService {
  constructor(
    private databaseService: DatabaseService,
    private fileService: FileService
  ){}


  async create(createPlanetDto: CreatePlanetDto){
    let response = await this.databaseService.createEntity(createPlanetDto, 'Planets');
    return this.editResponse(response);
  }
  async getAll(){
    let response = await this.databaseService.getAll('Planets');
    return response.map(elem => this.editResponse(elem));
  }
  async getSpecificPage(numberPage: number){
    let response = await this.databaseService.getSpecificPage('Planets', numberPage);
    return response.map(elem => this.editResponse(elem));
  }

  async getById(id:number){
    let response = await this.databaseService.getById('Planets', id)
    return this.editResponse(response);
  }

  async update(id:number, createPlanetDto: CreatePlanetDto){
    let response = await this.databaseService.updateEntity(id,createPlanetDto,'Planets');
    return this.editResponse(response);
  }

  async delete(id:number){
    let response = await this.databaseService.deleteEntity(id, 'Planets');
    return this.editResponse(response);
  }

  async addImages(images: Express.Multer.File[], id:number){
    let imagesName: string[] = [];
    images.forEach(image => {
      imagesName.push(image.filename);
    });
    try {
      await this.databaseService.uploadImages(imagesName, id, 'Planets');
      return {
        imagesName: imagesName
      }
    } catch (error) {
      throw new HttpException('No image file uploaded', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllImages(id:number){
    let images = await this.databaseService.getAllImages(id, 'Planets');
    return images?.map(image => {return {id: image.id, name: image.name}})
  }

  async getImageNameById(planetId: number, imageId: number){
    let image = await this.databaseService.getImageNameById(planetId, 'Planets', imageId)
    return {imageName: image, imageType: this.getImageType(image)};
  }

  async deleteImage(planetId: number, imageId: number){
    let image = await this.databaseService.deleteImageById(planetId, 'Planets', imageId);
    await this.fileService.deleteImage(image.name);
    return image;
  }

  /**
   * Method for editing planet data to be sent in response to the user.
   * @param response the planet data to be edited
   * @returns the edited data
   */
  editResponse(response: Planets){
    let planet = {
      id: response.id,
      name: response.name,
      rotation_period: response.rotation_period,
      orbital_period: response.orbital_period,
      diameter: response.diameter,
      climate: response.climate,
      gravity:response.gravity,
      terrain: response.terrain,
      surface_water: response.surface_water,
      population: response.population,
      residents: response.residents?.map(elem => elem.url),
      films: response.films?.map(elem => elem.url),
      images: response.images?.map(elem => elem.name),
      created: response.created,
      edited: response.edited,
      url: response.url
    }
    return planet;
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
