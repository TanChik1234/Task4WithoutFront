import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFilmDto } from 'dto/createFilm.dto';
import { DatabaseService } from 'src/modules/database/database.service';
import { Films } from 'src/entities/films.entity';
import { FileService } from 'src/modules/file/file.service';


@Injectable()
export class FilmsService {
  constructor(
    private databaseService: DatabaseService,
    private fileService: FileService
  ){}


  async create(createFilmDto: CreateFilmDto){
    let response = await this.databaseService.createEntity(createFilmDto, 'Films');
    return this.editResponse(response as Films);
  }
  async getAll(){
    let response = await this.databaseService.getAll('Films');
    return response.map(elem => this.editResponse(elem as Films));
  }
  async getSpecificPage(numberPage: number){
    let response = await this.databaseService.getSpecificPage('Films', numberPage);
    return response.map(elem => this.editResponse(elem as Films));
  }

  async getById(id:number){
    let response = await this.databaseService.getById('Films', id)
    return this.editResponse(response as Films);
  }

  async update(id:number, createFilmDto: CreateFilmDto){
    let response = await this.databaseService.updateEntity(id,createFilmDto,'Films');
    return this.editResponse(response as Films);
  }

  async delete(id:number){
    let response = await this.databaseService.deleteEntity(id, 'Films');
    return this.editResponse(response as Films);
  }

  async addImages(images: Express.Multer.File[], id:number){
    let imagesName: string[] = [];
    images.forEach(image => {
      imagesName.push(image.filename);
    });
    try {
      await this.databaseService.uploadImages(imagesName, id, 'Films');
      return {
        imagesName: imagesName
      }
    } catch (error) {
      throw new HttpException('No image file uploaded', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllImages(id:number){
    let images = await this.databaseService.getAllImages(id, 'Films');
    return images?.map(image => {return {id: image.id, name: image.name}})
  }

  async getImageNameById(filmId: number, imageId: number){
    let image = await this.databaseService.getImageNameById(filmId, 'Films', imageId)
    return {imageName: image, imageType: this.getImageType(image)};
  }

  async deleteImage(filmId: number, imageId: number){
    let image = await this.databaseService.deleteImageById(filmId, 'Films', imageId);
    await this.fileService.deleteImage(image.name);
    return image;
  }
  

  /**
   * Method for editing movie data to be sent in response to the user.
   * @param res the movie data to be edited
   * @returns the edited data
   */
  editResponse(res:  Films){
    let film = {
      id: res.id,
      title: res.title,
      episode_id: res.episode_id,
      opening_crawl: res.opening_crawl,
      director: res.director,
      producer: res.producer,
      release_date:res.release_date,
      characters: res.characters?.map(elem => elem.url),
      planets: res.planets?.map(elem => elem.url),
      starships: res.starships?.map(elem => elem.url),
      vehicles: res.vehicles?.map(elem => elem.url),
      species: res.species?.map(elem => elem.url),
      images: res.images?.map(elem => elem.name),
      created: res.created,
      edited: res.edited,
      url: res.url
    }
    return film;
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
