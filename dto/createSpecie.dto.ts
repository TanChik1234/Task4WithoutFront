import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsDateString, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateSpecieDto{
  @ApiProperty({description: "Species name", example: "Toydarian"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  name?: string | null;

  @ApiProperty({description: "Species classification", example: "mammal"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  classification?: string | null;

  @ApiProperty({description: "Species designation", example: "sentient"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  designation?: string | null;

  @ApiProperty({description: "Species average height", example: "120"})
  @IsOptional()
  @Transform(({value}) => +value || null)
  average_height?: number | null;

  @ApiProperty({description: "Species skin colors", example: "blue, green, grey"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  skin_colors?: string | null;

  @ApiProperty({description: "Species hair colors", example: "none"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  hair_colors?: string | null;

  @ApiProperty({description: "Species eye colors", example: "yellow"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  eye_colors?: string | null;

  @ApiProperty({description: "Species average lifespan", example: "91"})
  @IsOptional()
  @Transform(({value}) => +value || null)
  average_lifespan?: number | null;

  @ApiProperty({description: "Species homeworld", example: "https://swapi.dev/api/planets/34/"})
  @IsOptional()
  @IsUrl()
  homeworld?: string | null;

  @ApiProperty({description: "Species language", example: "Toydarian"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  language?: string | null;

  @ApiProperty({description: "Species representatives", example: [
		"https://swapi.dev/api/people/40/"
	]})
  @IsArray()
  @IsUrl({}, {each:true})
  people?: string[] = [];

  @ApiProperty({description: "Films", example: [
		"https://swapi.dev/api/films/4/",
		"https://swapi.dev/api/films/5/"
	]})
  @IsArray()
  @IsUrl({}, {each:true})
  films?: string[] = [];

  @ApiProperty({description: "Record Creation Date", example: "2014-12-19T17:48:56.893000Z"})
  @IsDateString()
  created?: string = (new Date()).toISOString();

  @ApiProperty({description: "Record Editing Date", example: "2014-12-20T21:36:42.165000Z"})
  @IsDateString()
  edited?: string = (new Date()).toISOString();

  @ApiProperty({description: "Species data URL", example: "https://swapi.dev/api/species/13/"})
  @IsUrl()
  url:string;

  [key: string]: string | number | null | undefined | string[];
}