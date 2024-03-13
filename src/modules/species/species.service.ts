import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSpecieDto } from 'dto/createSpecie.dto';
import { DatabaseService } from 'src/modules/database/database.service';
import { Species } from 'src/entities/species.entity';
import { FileService } from 'src/modules/file/file.service';


@Injectable()
export class SpeciesService {
  constructor(
    private databaseService: DatabaseService,
    private fileService: FileService
  ){}


  async create(createSpecieDto: CreateSpecieDto){
    let response = await this.databaseService.createEntity(createSpecieDto, 'Species');
    return this.editResponse(response);
  }
  async getAll(){
    let response = await this.databaseService.getAll('Species');
    return response.map(elem => this.editResponse(elem));
  }
  async getSpecificPage(numberPage: number){
    let response = await this.databaseService.getSpecificPage('Species', numberPage);
    return response.map(elem => this.editResponse(elem));
  }

  async getById(id:number){
    let response = await this.databaseService.getById('Species', id)
    return this.editResponse(response);
  }

  async update(id:number, createSpecieDto: CreateSpecieDto){
    let response = await this.databaseService.updateEntity(id,createSpecieDto,'Species');
    return this.editResponse(response);
  }

  async delete(id:number){
    let response = await this.databaseService.deleteEntity(id, 'Species');
    return this.editResponse(response);
  }

  async addImages(images: Express.Multer.File[], id:number){
    let imagesName: string[] = [];
    images.forEach(image => {
      imagesName.push(image.filename);
    });
    try {
      await this.databaseService.uploadImages(imagesName, id, 'Species');
      return {
        imagesName: imagesName
      }
    } catch (error) {
      throw new HttpException('No image file uploaded', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllImages(id:number){
    let images = await this.databaseService.getAllImages(id, 'Species');
    return images?.map(image => {return {id: image.id, name: image.name}})
  }

  async getImageNameById(specieId: number, imageId: number){
    let image = await this.databaseService.getImageNameById(specieId, 'Species', imageId)
    return {imageName: image, imageType: this.getImageType(image)};
  }

  async deleteImage(specieId: number, imageId: number){
    let image = await this.databaseService.deleteImageById(specieId, 'Species', imageId);
    await this.fileService.deleteImage(image.name);
    return image;
  }

  /**
   * Method for editing specie data to be sent in response to the user.
   * @param response the specie data to be edited
   * @returns the edited data
   */
  editResponse(response: Species){
    let specie = {
      id: response.id,
      name: response.name,
      classification: response.classification,
      designation: response.designation,
      average_height: response.average_height,
      skin_colors: response.skin_colors,
      hair_colors: response.hair_colors,
      eye_colors:response.eye_colors,
      average_lifespan: response.average_lifespan,
      homeworld: response.homeworld?.url,
      language: response.language,
      people: response.people?.map(elem => elem.url),
      films: response.films?.map(elem => elem.url),
      images: response.images?.map(elem => elem.name),
      created: response.created,
      edited: response.edited,
      url: response.url
    }
    return specie;
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
