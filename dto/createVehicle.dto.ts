import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsDateString, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateVehicleDto{
  @ApiProperty({description: "Vehicle name", example: "Sand Crawler"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  name?: string | null;

  @ApiProperty({description: "Vehicle model", example: "Digger Crawler"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  model?: string | null;

  @ApiProperty({description: "Vehicle manufacturer", example: "Corellia Mining Corporation"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  manufacturer?: string | null;

  @ApiProperty({description: "Vehicle cost in credits", example: 150000})
  @IsOptional()
  @Transform(({value}) => +value || null)
  cost_in_credits?: number | null;

  @ApiProperty({description: "Vehicle length", example: 36.8})
  @IsOptional()
  @Transform(({value}) => +value || null)
  length?: number | null;

  @ApiProperty({description: "Vehicle max atmosphering speed", example: 30})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  max_atmosphering_speed?: string | null;

  @ApiProperty({description: "Vehicle crew", example: 46})
  @IsOptional()
  @Transform(({value}) => +value || null)
  crew?: number | null;

  @ApiProperty({description: "Vehicle passengers", example: 30})
  @IsOptional()
  @Transform(({value}) => +value || null)
  passengers?: number | null;

  @ApiProperty({description: "Vehicle cargo capacity", example: 50000})
  @IsOptional()
  @Transform(({value}) => +value || null)
  cargo_capacity?: number | null;

  @ApiProperty({description: "Vehicle consumables", example: "2 months"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  consumables?: string | null;

  @ApiProperty({description: "Vehicle class", example: "wheeled"})
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  vehicle_class?: string | null;

  @ApiProperty({description: "Vehicle pilots", example: []})
  @IsArray()
  @IsUrl({}, {each: true})
  pilots?: string[] = [];

  @ApiProperty({description: "Films where it was Shown", example: []})
  @IsArray()
  @IsUrl({}, {each: true})
  films?: string[] = [];

  @ApiProperty({description: "Record Creation Date", example: "2020-09-17T17:46:31.415Z"})
  @IsDateString()
  created?: string = (new Date()).toISOString();

  @ApiProperty({description: "Record Editing Date", example: "2020-09-17T17:46:31.415Z"})
  @IsDateString()
  edited?: string = (new Date()).toISOString();

  @ApiProperty({description: "Vehicle Data URL", example: "https://swapi.dev/api/vehicles/4"})
  @IsUrl()
  url: string;

  [key: string]: string | number | null | undefined | string[];
}