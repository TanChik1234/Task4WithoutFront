import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVehicleDto } from 'dto/createVehicle.dto';
import { DatabaseService } from 'src/modules/database/database.service';
import { Vehicles } from 'src/entities/vehicles.entity';
import { FileService } from 'src/modules/file/file.service';


@Injectable()
export class VehiclesService {
  constructor(
    private databaseService: DatabaseService,
    private fileService: FileService
  ){}


  async create(createVehicleDto: CreateVehicleDto){
    let response = await this.databaseService.createEntity(createVehicleDto, 'Vehicles');
    return this.editResponse(response);
  }
  async getAll(){
    let response = await this.databaseService.getAll('Vehicles');
    return response.map(elem => this.editResponse(elem));
  }
  async getSpecificPage(numberPage: number){
    let response = await this.databaseService.getSpecificPage('Vehicles', numberPage);
    return response.map(elem => this.editResponse(elem));
  }

  async getById(id:number){
    let response = await this.databaseService.getById('Vehicles', id)
    return this.editResponse(response);
  }

  async update(id:number, createVehicleDto: CreateVehicleDto){
    let response = await this.databaseService.updateEntity(id,createVehicleDto,'Vehicles');
    return this.editResponse(response);
  }

  async delete(id:number){
    let response = await this.databaseService.deleteEntity(id, 'Vehicles');
    return this.editResponse(response);
  }

  async addImages(images: Express.Multer.File[], id:number){
    let imagesName: string[] = [];
    images.forEach(image => {
      imagesName.push(image.filename);
    });
    try {
      await this.databaseService.uploadImages(imagesName, id, 'Vehicles');
      return {
        imagesName: imagesName
      }
    } catch (error) {
      throw new HttpException('No image file uploaded', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllImages(id:number){
    let images = await this.databaseService.getAllImages(id, 'Vehicles');
    return images?.map(image => {return {id: image.id, name: image.name}})
  }

  async getImageNameById(vehicleId: number, imageId: number){
    let image = await this.databaseService.getImageNameById(vehicleId, 'Vehicles', imageId)
    return {imageName: image, imageType: this.getImageType(image)};
  }

  async deleteImage(vehicleId: number, imageId: number){
    let image = await this.databaseService.deleteImageById(vehicleId, 'Vehicles', imageId);
    await this.fileService.deleteImage(image.name);
    return image;
  }

  /**
   * Method for editing vehicle data to be sent in response to the user.
   * @param response  the vehicle data to be edited
   * @returns  the edited data
   */
  editResponse(response: Vehicles){
    let vehicle = {
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
      vehicle_class:response.vehicle_class,
      pilots: response.pilots?.map(elem => elem.url),
      films: response.films?.map(elem => elem.url),
      images: response.images?.map(elem => elem.name),
      created: response.created,
      edited: response.edited,
      url: response.url
    }
    return vehicle;
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
