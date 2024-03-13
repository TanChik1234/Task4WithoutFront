import { Transform } from "class-transformer";
import { IsArray, IsDateString, IsIn, IsNumber, IsObject, IsOptional, IsString, IsUrl } from "class-validator";


export class EntityDto{
  @IsNumber()
  id: number;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  title?: string | null;
  @Transform(({value}) => +value || null)
  episode_id?: number | null;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  opening_crawl?: string | null;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  director?: string | null;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  producer?: string | null;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null})
  release_date?: string | null;
  @IsOptional()
  @IsArray()
  characters?: EntityDto[];
  @IsOptional()
  @IsArray()
  planets?: EntityDto[];
  @IsOptional()
  @IsArray()
  starships?: EntityDto[];
  @IsOptional()
  @IsArray()
  vehicles?: EntityDto[];
  @IsOptional()
  @IsArray()
  species?: EntityDto[];
  @IsDateString()
  created?: string = (new Date()).toISOString();
  @IsDateString()
  edited?: string = (new Date()).toISOString();
  @IsUrl()
  url: string;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  name?: string | null;
  @IsOptional()
  @Transform(({value}) => +value || null)
  height?: number | null;
  @IsOptional()
  @Transform(({value}) => +value || null)
  mass?: number | null; 
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  hair_color?: string | null;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  skin_color?: string | null;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  eye_color?: string | null;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return /^\d{1,}BBY/i.test(value) ? value : null})
  birth_year?: string | null;
  @IsOptional()
  @IsIn(['male', 'female'])
  gender?: string | null;
  @IsOptional()
  @IsObject()
  homeworld?: EntityDto | null;
  @IsOptional()
  @IsArray()
  films?: EntityDto[]
  @IsOptional()
  @Transform(({value}) => +value || null)
  rotation_period?: number | null;
  @IsOptional()
  @Transform(({value}) => +value || null)
  orbital_period?: number | null;
  @IsOptional()
  @Transform(({value}) => +value || null)
  diameter?: number | null;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  climate?: string | null;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  gravity?: string | null;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  terrain?: string | null;
  @IsOptional()
  @Transform(({value}) => +value || null)
  surface_water?: number | null;
  @IsOptional()
  @Transform(({value}) => +value || null)
  population?: number | null ;
  @IsArray()
  residents?: EntityDto[];
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  classification?: string | null;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  designation?: string | null;
  @IsOptional()
  @Transform(({value}) => +value || null)
  average_height?: number | null;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  skin_colors?: string | null;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  hair_colors?: string | null;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  eye_colors?: string | null;
  @IsOptional()
  @Transform(({value}) => +value || null)
  average_lifespan?: number | null;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  language?: string | null;
  @IsArray()
  people?: EntityDto[];
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  model?: string | null;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  manufacturer?: string | null;
  @IsOptional()
  @Transform(({value}) => +value || null)
  cost_in_credits?: number | null;
  @IsOptional()
  @Transform(({value}) => +value || null)
  length?: number | null;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  max_atmosphering_speed?: string | null;
  @IsOptional()
  @Transform(({value}) => +value || null)
  crew?: number | null;
  @IsOptional()
  @Transform(({value}) => +value || null)
  passengers?: number | null;
  @IsOptional()
  @Transform(({value}) => +value || null)
  cargo_capacity?: number | null;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  consumables?: string | null;
  @IsOptional()
  @Transform(({value}) => +value || null)
  hyperdrive_rating?: number | null;
  @IsOptional()
  @Transform(({value}) => +value || null)
  MGLT?: number | null;
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  starship_class?: string | null;
  @IsArray()
  pilots?: EntityDto[];
  @IsOptional()
  @IsString()
  @Transform(({value}) =>  {return value === 'unknown' ? null : value})
  vehicle_class?: string | null;



  [key: string]: string | number | null | undefined | EntityDto[] | EntityDto;
}