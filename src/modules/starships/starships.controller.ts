import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateStarshipDto } from 'dto/createStarship.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import { Response } from 'express';
import * as fs from 'fs';
import { Role } from 'src/modules/users/decorators/role.decorator';

@ApiTags('Starships')
@Controller('starships')
@ApiBearerAuth()
export class StarshipsController {
  constructor(private readonly starshipsService: StarshipsService){}


  @Get()
  @Role('admin')
  @ApiResponse({status: 200, description: "Get last 10 starships"})
  get(){
    return this.starshipsService.getAll();
  }

  @Get('page/:numberPage')
  @ApiResponse({status: 200, description: 'Get specific page'})
  getSpecificPage(@Param('numberPage') numberPage: string){
    return this.starshipsService.getSpecificPage(+numberPage);
  }

  @Get(':id')
  @ApiResponse({status: 200, description: "Get last 10 starships"})
  getByTen(@Param('id') id:string){
    return this.starshipsService.getById(+id);
  }

  @Post()
  @Role('admin')
  @ApiResponse({status:200, description: "Create starship"})
  createPerson(@Body() createStarshipDto: CreateStarshipDto){
    return this.starshipsService.create(createStarshipDto);
  }

  @Patch(':id')
  @Role('admin')
  @ApiResponse({status:200, description: 'Delete Person'})
  updatePerson(@Param('id') id: string, @Body() createStarshipDto: CreateStarshipDto){
    return this.starshipsService.update(+id, createStarshipDto);
  }

  @Delete(':id')
  @Role('admin')
  @ApiResponse({status: 200, description: 'Delete starship'})
  deletePerson(@Param('id') id: string){
    return this.starshipsService.delete(+id);
  }

  @Post(':starshipId/images')
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
  async uploadedMultipleFiles(@UploadedFiles() files: Express.Multer.File[], @Param('starshipId') starshipId: string){
    return await this.starshipsService.addImages(files, +starshipId);
  }

  @Get(':starshipId/images')
  @ApiResponse({status:200, description: 'Get all images by Entity id'})
  async getImages( @Param('starshipId') starshipId: string) {
    let images = await this.starshipsService.getAllImages(+starshipId);
    return images;  
  }

  @Get(':starshipId/images/:imageId')
  @ApiResponse({status:200, description: 'Find image by id'})
  async getImageById(@Res() res: Response, @Param('starshipId') starshipId: string,
    @Param('imageId') imageId: string){
      try {
        let image = await this.starshipsService.getImageNameById(+starshipId, +imageId);
        let imagePath = `./uploads/${image.imageName}`
        res.setHeader('Content-Type', `image/${image.imageType}`);
        const imageStream = fs.createReadStream(imagePath)
        imageStream.pipe(res);
      } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
      }
  }

  @Delete(':starshipId/images/:imageId')
  @ApiResponse({status:200, description: 'Delete image'})
  async deleteImage(@Res() res: Response, @Param('starshipId') starshipId: string,
    @Param('imageId') imageId: string){
      try {
        let result = await this.starshipsService.deleteImage(+starshipId, +imageId);
        return res.status(200).json({data: result});
      } catch (error) {
        throw new Error('some error in controller')
      }

}
}
