import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsDateString, IsOptional, IsString, IsUrl, Matches } from "class-validator";

export class CreateFilmDto{
  @ApiProperty({description: "Film title", example: "A New Hope"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  title?: string | null;

  @ApiProperty({description: "Episode identifier", example: 4})
  @Transform(({value}) => +value || null)
  episode_id?: number | null;

  @ApiProperty({description: "Film description", example: `It is a period of civil war.\r\nRebel spaceships, 
  striking\r\nfrom a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic 
  Empire.\r\n\r\nDuring the battle, Rebel\r\nspies managed to steal secret\r\nplans to the
  Empire's\r\nultimate weapon, the DEATH\r\nSTAR, an armored space\r\nstation with enough 
  power\r\nto destroy an entire planet.\r\n\r\nPursued by the Empire's\r\nsinister agents, 
  Princess\r\nLeia races home aboard her\r\nstarship, custodian of the\r\nstolen plans that 
  can save her\r\npeople and restore\r\nfreedom to the galaxy....`})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  opening_crawl?: string | null;

  @ApiProperty({description: "Film director", example: "George Lucas",})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  director?: string | null;

  @ApiProperty({description: "Film producer", example: "Gary Kurtz, Rick McCallum",})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  producer?: string | null;


  
  @ApiProperty({description: "Film release date", example: "1977-05-25",})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null})
  release_date?: string | null;

  @ApiProperty({description: "Film characters", example: [
		"https://swapi.dev/api/people/1/",
		"https://swapi.dev/api/people/2/",
		"https://swapi.dev/api/people/3/",
		"https://swapi.dev/api/people/4/",
		"https://swapi.dev/api/people/5/",
		"https://swapi.dev/api/people/6/",
		"https://swapi.dev/api/people/7/",
		"https://swapi.dev/api/people/8/",
		"https://swapi.dev/api/people/9/",
		"https://swapi.dev/api/people/10/",
		"https://swapi.dev/api/people/12/",
		"https://swapi.dev/api/people/13/",
		"https://swapi.dev/api/people/14/",
		"https://swapi.dev/api/people/15/",
		"https://swapi.dev/api/people/16/",
		"https://swapi.dev/api/people/18/",
		"https://swapi.dev/api/people/19/",
		"https://swapi.dev/api/people/81/"
	]})
  @IsArray()
  @IsUrl({}, {each:true})
  characters?: string[] = [];

  @ApiProperty({description: "Planets featured in the film", example: [
		"https://swapi.dev/api/planets/1/",
		"https://swapi.dev/api/planets/2/",
		"https://swapi.dev/api/planets/3/"
	]})
  @IsArray()
  @IsUrl({}, {each:true})
  planets?: string[] = [];

  @ApiProperty({description: "Spaceships shown", example: [
		"https://swapi.dev/api/starships/2/",
		"https://swapi.dev/api/starships/3/",
		"https://swapi.dev/api/starships/5/",
		"https://swapi.dev/api/starships/9/",
		"https://swapi.dev/api/starships/10/",
		"https://swapi.dev/api/starships/11/",
		"https://swapi.dev/api/starships/12/",
		"https://swapi.dev/api/starships/13/"
	]})
  @IsArray()
  @IsUrl({}, {each:true})
  starships?: string[] = [];

  @ApiProperty({description: "Vehicles shown", example: [
		"https://swapi.dev/api/vehicles/4/",
		"https://swapi.dev/api/vehicles/6/",
		"https://swapi.dev/api/vehicles/7/",
		"https://swapi.dev/api/vehicles/8/"
	]})
  @IsArray()
  @IsUrl({}, {each:true})
  vehicles?: string[] = [];

  @ApiProperty({description: "Species Shown", example: [
		"https://swapi.dev/api/species/1/",
		"https://swapi.dev/api/species/2/",
		"https://swapi.dev/api/species/3/",
		"https://swapi.dev/api/species/4/",
		"https://swapi.dev/api/species/5/"
	]})
  @IsArray()
  @IsUrl({}, {each:true})
  species?: string[] = [];

  @ApiProperty({description: "Record Creation Date", example: "2014-12-10T14:23:31.880000Z"})
  @IsDateString()
  created?: string = (new Date()).toISOString();

  @ApiProperty({description: "Record Editing Date", example: "2014-12-20T19:49:45.256000Z"})
  @IsDateString()
  edited?: string = (new Date()).toISOString();

  @ApiProperty({description: "Film information URL", example: "https://swapi.dev/api/films/1/"})
  @IsUrl()
  url: string;


  [key: string]: string | number | null | undefined | string[];
}