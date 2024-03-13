import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsDateString, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateStarshipDto{
  @ApiProperty({description: "Starship name", example: "Death Star"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  name?: string | null;

  @ApiProperty({description: "Starship model", example: "DS-1 Orbital Battle Station"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  model?: string | null;

  @ApiProperty({description: "Starship manufacturer", example: "Imperial Department of Military Research, Sienar Fleet Systems"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  manufacturer?: string | null;

  @ApiProperty({description: "Starship  cost in credits", example: "1000000000000"})
  @IsOptional()
  @Transform(({value}) => +value || null)
  cost_in_credits?: number | null;

  @ApiProperty({description: "Starship length", example: "120000"})
  @IsOptional()
  @Transform(({value}) => +value || null)
  length?: number | null;

  @ApiProperty({description: "Starship max atmosphering speed", example: "n/a"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  max_atmosphering_speed?: string | null;

  @ApiProperty({description: "Starship crew", example: "342,953"})
  @IsOptional()
  @Transform(({value}) => +value || null)
  crew?: number | null;

  @ApiProperty({description: "Starship passenger quantity", example: "843,342"})
  @IsOptional()
  @Transform(({value}) => +value || null)
  passengers?: number | null;

  @ApiProperty({description: "Starship cargo capacity", example: "1000000000000"})
  @IsOptional()
  @Transform(({value}) => +value || null)
  cargo_capacity?: number | null;

  @ApiProperty({description: "Starship consumables", example: "3 years"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  consumables?: string | null;

  @ApiProperty({description: "Starship hyperdrive rating", example: "4.0"})
  @IsOptional()
  @Transform(({value}) => +value || null)
  hyperdrive_rating?: number | null;

  @ApiProperty({description: "Starship MGLT", example: "10"})
  @IsOptional()
  @Transform(({value}) => +value || null)
  MGLT?: number | null;

  @ApiProperty({description: "Starship class", example: "Deep Space Mobile Battlestation"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  starship_class?: string | null;

  @ApiProperty({description: "Starship pilots", example: []})
  @IsArray()
  @IsUrl({}, {each: true})
  pilots?: string[] = [];

  @ApiProperty({description: "Films where it was Shown", example: [
		"https://swapi.dev/api/films/1/"
	]})
  @IsArray()
  @IsUrl({}, {each: true})
  films?: string[] = [];

  @ApiProperty({description: "Record Creation Date", example: "2014-12-10T16:36:50.509000Z"})
  @IsDateString()
  created?: string = (new Date()).toISOString();

  @ApiProperty({description: "Record Editing Date", example: "2014-12-20T21:26:24.783000Z"})
  @IsDateString()
  edited?: string = (new Date()).toISOString();

  @ApiProperty({description: "Starship data URL", example: "https://swapi.dev/api/starships/9/"})
  @IsUrl()
  url: string;


  [key: string]: string | number | null | undefined | string[];
}