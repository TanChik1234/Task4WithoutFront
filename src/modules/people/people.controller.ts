import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PeopleService } from './people.service';
import { CreatePeopleDto } from 'dto/createPeople.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import * as fs from 'fs';
import { Response } from 'express';
import { Role } from 'src/modules/users/decorators/role.decorator';

@ApiTags('People')
@Controller('people')
@ApiBearerAuth()
export class PeopleController {
  constructor(private readonly peopleService: PeopleService){}


  @Get()
  @Role('admin')
  @ApiResponse({status: 200, description: "Get last 10 people"})
  get(){
    return this.peopleService.getAll();
  }

  @Get('page/:numberPage')
  @ApiResponse({status: 200, description: 'Get specific page'})
  getSpecificPage(@Param('numberPage') numberPage: string){
    return this.peopleService.getSpecificPage(+numberPage);
  }

  @Get(':id')
  @ApiResponse({status: 200, description: "Get last 10 people"})
  getByTen(@Param('id') id:string){
    return this.peopleService.getById(+id);
  }

  @Post()
  @Role('admin')
  @ApiResponse({status:200, description: "Create person"})
  createPerson(@Body() createPeopleDto: CreatePeopleDto){
    return this.peopleService.create(createPeopleDto);
  }

  @Patch(':id')
  @Role('admin')
  @ApiResponse({status:200, description: 'Delete Person'})
  updatePerson(@Param('id') id: string, @Body() createPeopleDto: CreatePeopleDto){
    return this.peopleService.update(+id, createPeopleDto);
  }

  @Delete(':id')
  @Role('admin')
  @ApiResponse({status: 200, description: 'Delete person'})
  deletePerson(@Param('id') id: string){
    return this.peopleService.delete(+id);
  }

  
  @Post(':personId/images/')
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
  async uploadedMultipleFiles(@UploadedFiles() files: Express.Multer.File[], 
    @Param('personId') personId: string){
      return await this.peopleService.addImages(files, +personId);
  }

  @Get(':personId/images')
  @ApiResponse({status:200, description: 'Get all images by Entity id'})
  async getImages( @Param('personId') personId: string) {
    let images = await this.peopleService.getAllImages(+personId);
    return images;  
  }

  @Get(':personId/images/:imageId')
  @ApiResponse({status:200, description: 'Find image by id', type: 'string'})
  async getImageById(@Res() res: Response, @Param('personId') personId: string,
    @Param('imageId') imageId: string){
      try {
        let image = await this.peopleService.getImageNameById(+personId, +imageId);
        let imagePath = `./uploads/${image.imageName}`
        res.setHeader('Content-Type', `image/${image.imageType}`);
        const imageStream = fs.createReadStream(imagePath)
        imageStream.pipe(res);
      } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
      }

  }

  @Delete(':peopleId/images/:imageId')
  @ApiResponse({status:200, description: 'Delete image'})
  async deleteImage(@Res() res: Response, @Param('peopleId') peopleId: string,
    @Param('imageId') imageId: string){
      try {
        let result = await this.peopleService.deleteImage(+peopleId, +imageId);
        return res.status(200).json({data: result});
      } catch (error) {
        throw new Error('some error in controller')
      }

}

}
