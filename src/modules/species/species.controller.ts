import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SpeciesService } from './species.service';
import { CreateSpecieDto } from 'dto/createSpecie.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import { Response } from 'express';
import * as fs from 'fs';
import { Role } from 'src/modules/users/decorators/role.decorator';

@ApiTags('Species')
@Controller('species')
@ApiBearerAuth()
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService){}


  @Get()
  @Role('admin')
  @ApiResponse({status: 200, description: "Get last 10 species"})
  get(){
    return this.speciesService.getAll();
  }

  @Get('page/:numberPage')
  @ApiResponse({status: 200, description: 'Get specific page'})
  getSpecificPage(@Param('numberPage') numberPage: string){
    return this.speciesService.getSpecificPage(+numberPage);
  }

  @Get(':id')
  @ApiResponse({status: 200, description: "Get last 10 species"})
  getByTen(@Param('id') id:string){
    return this.speciesService.getById(+id);
  }

  @Post()
  @Role('admin')
  @ApiResponse({status:200, description: "Create specie"})
  createPerson(@Body() createSpecieDto: CreateSpecieDto){
    return this.speciesService.create(createSpecieDto);
  }

  @Patch(':id')
  @Role('admin')
  @ApiResponse({status:200, description: 'Delete Person'})
  updatePerson(@Param('id') id: string, @Body() createSpecieDto: CreateSpecieDto){
    return this.speciesService.update(+id, createSpecieDto);
  }

  @Delete(':id')
  @Role('admin')
  @ApiResponse({status: 200, description: 'Delete specie'})
  deletePerson(@Param('id') id: string){
    return this.speciesService.delete(+id);
  }

  @Post(':specieId/images')
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
  async uploadedMultipleFiles(@UploadedFiles() files: Express.Multer.File[], @Param('specieId') specieId: string){
    return await this.speciesService.addImages(files, +specieId);
  }

  @Get(':specieId/images')
  @ApiResponse({status:200, description: 'Get all images by Entity id'})
  async getImages( @Param('specieId') specieId: string) {
    let images = await this.speciesService.getAllImages(+specieId);
    return images;  
  }

  @Get(':specieId/images/:imageId')
  @ApiResponse({status:200, description: 'Find image by id'})
  async getImageById(@Res() res: Response, @Param('specieId') specieId: string,
    @Param('imageId') imageId: string){
      try {
        let image = await this.speciesService.getImageNameById(+specieId, +imageId);
        let imagePath = `./uploads/${image.imageName}`
        res.setHeader('Content-Type', `image/${image.imageType}`);
        const imageStream = fs.createReadStream(imagePath)
        imageStream.pipe(res);
      } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
      }
  }

  @Delete(':specieId/images/:imageId')
  @ApiResponse({status:200, description: 'Delete image'})
  async deleteImage(@Res() res: Response, @Param('specieId') specieId: string,
    @Param('imageId') imageId: string){
      try {
        let result = await this.speciesService.deleteImage(+specieId, +imageId);
        return res.status(200).json({data: result});
      } catch (error) {
        throw new Error('some error in controller')
      }

}
}
