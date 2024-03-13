import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsDateString, IsIn, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePeopleDto {
  @ApiProperty({description: "Character name", example: 'Luke Skywalker'})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? undefined : value})
  name?: string | undefined;

  @ApiProperty({description: 'Character height', example: '172'})
  @IsOptional()
  @Transform(({value}) => +value || undefined)
  height?: number | undefined;

  @ApiProperty({description: 'Character mass', example: '77'})
  @IsOptional()
  @Transform(({value}) => +value || undefined)
  mass?: number | undefined;  

  @ApiProperty({description: 'Character hair color', example: 'blond'})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? undefined : value})
  hair_color?: string | undefined;

  @ApiProperty({description: 'Character skin color', example: 'fair'})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? undefined : value})
  skin_color?: string | undefined;
  
  @ApiProperty({description: 'Character eye color', example: 'blue'})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? undefined : value})
  eye_color?: string | undefined;


  @ApiProperty({description: 'Character birth year', example: '19BBY'})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return /^\d{1,}BBY/i.test(value) ? value : undefined})
  birth_year?: string | undefined;

  @ApiProperty({description: 'Character gender', example: 'male'})
  @IsOptional()
  @IsIn(['male', 'female'])
  gender?: string | undefined;

  @ApiProperty({description: 'Character homeworld', example: 'https://swapi.dev/api/planets/1/'})
  @IsOptional()
  @IsUrl()
  homeworld?: string | undefined;

  @ApiProperty({description: "Movies character appeared in", example: [
		"https://swapi.dev/api/films/1/",
		"https://swapi.dev/api/films/2/",
		"https://swapi.dev/api/films/3/",
		"https://swapi.dev/api/films/6/"
	]})
  @IsArray()
  @IsUrl({}, {each: true})
  films?: string[] = []
 
  @ApiProperty({description: 'Species affiliation', example: []})
  @IsArray()
  @IsUrl({}, {each: true})
  species?: string[] = []  

  @ApiProperty({description: 'Vehicles operated by', example: [
		"https://swapi.dev/api/vehicles/14/",
		"https://swapi.dev/api/vehicles/30/"
	]})
  @IsArray()
  @IsUrl({}, {each: true})
  vehicles?: string[] = []

  @ApiProperty({description: 'Spaceship flown on', example: [
		"https://swapi.dev/api/starships/12/",
		"https://swapi.dev/api/starships/22/"
	]})
  @IsArray()
  @IsUrl({}, {each: true})
  starships?: string[] = []

  @ApiProperty({description: 'Record Creation Date', example: '2014-12-09T13:50:51.644000Z'})
  @IsDateString()
  created?: string = (new Date()).toISOString();

  @ApiProperty({description: 'Record Editing Date', example: '2014-12-20T21:17:56.891000Z'})
  @IsDateString()
  edited?: string = (new Date()).toISOString();

  @ApiProperty({description: 'Character information URL', example: 'https://swapi.dev/api/people/1/'})
  @IsUrl()
  url: string;


  [key: string]: string | number | null | undefined | string[];
}