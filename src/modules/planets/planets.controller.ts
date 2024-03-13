import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlanetsService } from './planets.service';
import { CreatePlanetDto } from 'dto/createPlanet.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import { Response } from 'express';
import * as fs from 'fs';
import { Role } from 'src/modules/users/decorators/role.decorator';

@ApiTags('Planets')
@Controller('planets')
@ApiBearerAuth()
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService){}


  @Get()
  @Role('admin')
  @ApiResponse({status: 200, description: "Get last 10 planets"})
  get(){
    return this.planetsService.getAll();
  }

  @Get('page/:numberPage')
  @ApiResponse({status: 200, description: 'Get specific page'})
  getSpecificPage(@Param('numberPage') numberPage: string){
    return this.planetsService.getSpecificPage(+numberPage);
  }

  @Get(':id')
  @ApiResponse({status: 200, description: "Get last 10 planets"})
  getByTen(@Param('id') id:string){
    return this.planetsService.getById(+id);
  }

  @Post()
  @Role('admin')
  @ApiResponse({status:200, description: "Create planet"})
  createPerson(@Body() createPlanetDto: CreatePlanetDto){
    return this.planetsService.create(createPlanetDto);
  }

  @Patch(':id')
  @Role('admin')
  @ApiResponse({status:200, description: 'Delete Person'})
  updatePerson(@Param('id') id: string, @Body() createPlanetDto: CreatePlanetDto){
    return this.planetsService.update(+id, createPlanetDto);
  }

  @Delete(':id')
  @Role('admin')
  @ApiResponse({status: 200, description: 'Delete planet'})
  deletePerson(@Param('id') id: string){
    return this.planetsService.delete(+id);
  }

  @Post(':planetId/images')
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
  async uploadedMultipleFiles(@UploadedFiles() files: Express.Multer.File[], @Param('planetId') planetId: string){
    return await this.planetsService.addImages(files, +planetId);
  }

  @Get(':planetId/images')
  @ApiResponse({status:200, description: 'Get all images by Entity id'})
  async getImages( @Param('planetId') planetId: string) {
    let images = await this.planetsService.getAllImages(+planetId);
    return images;  
  }

  @Get(':planetId/images/:imageId')
  @ApiResponse({status:200, description: 'Find image by id'})
  async getImageById(@Res() res: Response, @Param('planetId') planetId: string,
    @Param('imageId') imageId: string){
      try {
        let image = await this.planetsService.getImageNameById(+planetId, +imageId);
        let imagePath = `./uploads/${image.imageName}`
        res.setHeader('Content-Type', `image/${image.imageType}`);
        const imageStream = fs.createReadStream(imagePath)
        imageStream.pipe(res);
      } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
      }
  }

  @Delete(':planetId/images/:imageId')
  @ApiResponse({status:200, description: 'Delete image'})
  async deleteImage(@Res() res: Response, @Param('planetId') planetId: string,
    @Param('imageId') imageId: string){
      try {
        let result = await this.planetsService.deleteImage(+planetId, +imageId);
        return res.status(200).json({data: result});
      } catch (error) {
        throw new Error('some error in controller')
      }

}
}
