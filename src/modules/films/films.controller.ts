import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FilmsService } from './films.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import { Response } from 'express';
import { CreateFilmDto } from 'dto/createFilm.dto';
import * as fs from 'fs';
import { Role } from 'src/modules/users/decorators/role.decorator';

@ApiTags('Films')
@Controller('films')
@ApiBearerAuth()
export class FilmsController {
  constructor(private readonly filmService: FilmsService){}

  @Get()
  @Role('admin')
  @ApiResponse({status: 200, description: "Get all films"})
  get(){
    return this.filmService.getAll();
  }

  @Get('page/:numberPage')

  @ApiResponse({status: 200, description: 'Get specific page'})
  getSpecificPage(@Param('numberPage') numberPage: string){
    return this.filmService.getSpecificPage(+numberPage);
  }

  @Get(':id')
  @ApiResponse({status: 200, description: "Find film by ID"})
  getByTen(@Param('id') id:string){
    return this.filmService.getById(+id);
  }

  @Post()
  @Role('admin')
  @ApiResponse({status:200, description: "Create film"})
  createPerson(@Body() createFilmDto: CreateFilmDto){
    return this.filmService.create(createFilmDto);
  }

  @Patch(':id')
  @Role('admin')
  @ApiResponse({status:200, description: 'Delete film'})
  updatePerson(@Param('id') id: string, @Body() createFilmDto: CreateFilmDto){
    return this.filmService.update(+id, createFilmDto);
  }

  @Delete(':id')
  @Role('admin')
  @ApiResponse({status: 200, description: 'Delete film'})
  deletePerson(@Param('id') id: string){
    return this.filmService.delete(+id);
  }

  @Post(':filmId/images')
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
  async uploadedMultipleFiles(@UploadedFiles() files: Express.Multer.File[], @Param('filmId') filmId: string){
    return await this.filmService.addImages(files, +filmId);
  }

  @Get(':filmId/images')
  @ApiResponse({status:200, description: 'Get all images by Entity id'})
  async getImages( @Param('filmId') filmId: string) {
    let images = await this.filmService.getAllImages(+filmId);
    return images;  
  }

  @Get(':filmId/images/:imageId')
  @ApiResponse({status:200, description: 'Find image by id', type: 'string'})
  async getImageById(@Res() res: Response, @Param('filmId') filmId: string,
    @Param('imageId') imageId: string){
      try {
        let image = await this.filmService.getImageNameById(+filmId, +imageId);
        let imagePath = `./uploads/${image.imageName}`
        res.setHeader('Content-Type', `image/${image.imageType}`);
        const imageStream = fs.createReadStream(imagePath)
        imageStream.pipe(res);
      } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
      }
  }

  @Delete(':filmId/images/:imageId')
  @ApiResponse({status:200, description: 'Delete image'})
  async deleteImage(@Res() res: Response, @Param('filmId') filmId: string,
    @Param('imageId') imageId: string){
      try {
        let result = await this.filmService.deleteImage(+filmId, +imageId);
        return res.status(200).json({data: result});
      } catch (error) {
        throw new Error('some error in controller')
      }

}

  
}
