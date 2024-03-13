import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from 'dto/createVehicle.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import { Response } from 'express';
import * as fs from 'fs';
import { Role } from 'src/modules/users/decorators/role.decorator';

@ApiTags('Vehicles')
@Controller('vehicles')
@ApiBearerAuth()
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService){}


  @Get()
  @Role('admin')
  @ApiResponse({status: 200, description: "Get last 10 vehicles"})
  get(){
    return this.vehiclesService.getAll();
  }

  @Get('page/:numberPage')
  @ApiResponse({status: 200, description: 'Get specific page'})
  getSpecificPage(@Param('numberPage') numberPage: string){
    return this.vehiclesService.getSpecificPage(+numberPage);
  }

  @Get(':id')
  @ApiResponse({status: 200, description: "Get last 10 vehicles"})
  getByTen(@Param('id') id:string){
    return this.vehiclesService.getById(+id);
  }

  @Post()
  @Role('admin')
  @ApiResponse({status:200, description: "Create vehicle"})
  createPerson(@Body() createVehicleDto: CreateVehicleDto){
    return this.vehiclesService.create(createVehicleDto);
  }

  @Patch(':id')
  @Role('admin')
  @ApiResponse({status:200, description: 'Delete Person'})
  updatePerson(@Param('id') id: string, @Body() createVehicleDto: CreateVehicleDto){
    return this.vehiclesService.update(+id, createVehicleDto);
  }

  @Delete(':id')
  @Role('admin')
  @ApiResponse({status: 200, description: 'Delete vehicle'})
  deletePerson(@Param('id') id: string){
    return this.vehiclesService.delete(+id);
  }

  @Post(':vehicleId/images')
  @ApiOperation({ summary: 'Upload multiple images' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({status:200, description: 'Update images'})
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  async uploadedMultipleFiles(@UploadedFiles() files: Express.Multer.File[], @Param('vehicleId') vehicleId: string){
    return await this.vehiclesService.addImages(files, +vehicleId);
  }

  @Get(':vehicleId/images')
  @ApiResponse({status:200, description: 'Get all images by Entity id'})
  async getImages( @Param('vehicleId') vehicleId: string) {
    let images = await this.vehiclesService.getAllImages(+vehicleId);
    return images;  
  }

  @Get(':vehicleId/images/:imageId')
  @ApiResponse({status:200, description: 'Find image by id'})
  async getImageById(@Res() res: Response, @Param('vehicleId') vehicleId: string,
    @Param('imageId') imageId: string){
      try {
        let image = await this.vehiclesService.getImageNameById(+vehicleId, +imageId);
        let imagePath = `./uploads/${image.imageName}`
        res.setHeader('Content-Type', `image/${image.imageType}`);
        const imageStream = fs.createReadStream(imagePath)
        imageStream.pipe(res);
      } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
      }
  }

  @Delete(':vehicleId/images/:imageId')
  @ApiResponse({status:200, description: 'Delete image'})
  async deleteImage(@Res() res: Response, @Param('vehicleId') vehicleId: string,
    @Param('imageId') imageId: string){
      try {
        let result = await this.vehiclesService.deleteImage(+vehicleId, +imageId);
        return res.status(200).json({data: result});
      } catch (error) {
        throw new Error('some error in controller')
      }

}
}
