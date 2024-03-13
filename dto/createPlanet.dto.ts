import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsDateString, IsOptional, IsString, IsUrl } from "class-validator";

export class CreatePlanetDto{
  @ApiProperty({description: "Planet name", example: "Yavin IV"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  name?: string | null;;

  @ApiProperty({description: "Planet rotation period", example: "24"})
  @IsOptional()
  @Transform(({value}) => +value || null)
  rotation_period?: number | null;

  @ApiProperty({description: "Planet orbital period", example: "4818"})
  @IsOptional()
  @Transform(({value}) => +value || null)
  orbital_period?: number | null;

  @ApiProperty({description: "Planet diameter", example: "10200"})
  @IsOptional()
  @Transform(({value}) => +value || null)
  diameter?: number | null;

  @ApiProperty({description: "Planet climate", example: "temperate, tropical"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  climate?: string | null;

  @ApiProperty({description: "Planet gravity", example: "1 standard"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  gravity?: string | null;

  @ApiProperty({description: "Planet terrain", example: "jungle, rainforests"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  terrain?: string | null;

  @ApiProperty({description: "Planet surface water", example: "8"})
  @IsOptional()
  @Transform(({value}) => +value || null)
  surface_water?: number | null;

  @ApiProperty({description: "Planet population", example: "1000"})
  @IsOptional()
  @Transform(({value}) => +value || null)
  population?: number | null ;

  @ApiProperty({description: "Planet residents", example: []})
  @IsArray()
  @IsUrl({}, {each: true})
  residents?: string[] = [];

  @ApiProperty({description: "Films featuring the planet", example: [
		"https://swapi.dev/api/films/1/"
	]})
  @IsArray()
  @IsUrl({}, {each: true})
  films?: string[] = [];

  @ApiProperty({description: "Record Creation Date", example: "2014-12-10T11:37:19.144000Z"})
  @IsDateString()
  created?: string = (new Date()).toISOString();

  @ApiProperty({description: "Record Editing Date", example: "2014-12-20T20:58:18.421000Z"})
  @IsDateString()
  edited?: string = (new Date()).toISOString();

  @ApiProperty({description: "Planet information URL", example: "https://swapi.dev/api/planets/3/"})
  @IsUrl()
  url: string;


  [key: string]: string | number | null | undefined | string[];
}