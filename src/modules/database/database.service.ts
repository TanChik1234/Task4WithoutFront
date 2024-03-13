import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFilmDto } from 'dto/createFilm.dto';
import { CreatePeopleDto } from 'dto/createPeople.dto';
import { CreatePlanetDto } from 'dto/createPlanet.dto';
import { CreateSpecieDto } from 'dto/createSpecie.dto';
import { CreateStarshipDto } from 'dto/createStarship.dto';
import { CreateVehicleDto } from 'dto/createVehicle.dto';
import { Films } from 'src/entities/films.entity';
import { Images } from 'src/entities/images.entity';
import { People } from 'src/entities/people.entity';
import { Planets } from 'src/entities/planets.entity';
import { Species } from 'src/entities/species.entity';
import { Starships } from 'src/entities/starships.entity';
import { Vehicles } from 'src/entities/vehicles.entity';
import { Repository } from 'typeorm';

type MyRepository = Repository<(People|Planets|Films|Species|Starships|Vehicles)>
type NameEntity = 'People'|'Planets'|'Films'|'Species'|'Starships'|'Vehicles'
type Dto = CreatePeopleDto | CreatePlanetDto | CreateFilmDto 
  | CreateSpecieDto | CreateStarshipDto | CreateVehicleDto

@Injectable()
export class DatabaseService {
  constructor(
    @Inject('PEOPLE_REPOSITORY')
    private peopleRepository: Repository<People>,
    @Inject('FILMS_REPOSITORY')
    private filmsRepository: Repository<Films>,
    @Inject('PLANETS_REPOSITORY')
    private planetsRepository: Repository<Planets>,
    @Inject('SPECIES_REPOSITORY')
    private speciesRepository: Repository<Species>,
    @Inject('STARSHIPS_REPOSITORY')
    private starshipsRepository: Repository<Starships>,
    @Inject('VEHICLES_REPOSITORY')
    private vehiclesRepository: Repository<Vehicles>,
    @Inject('IMAGE_REPOSITORY')
    private imagesRepository: Repository<Images>
  ) {}


  /**
   * This method allows retrieving data about all entities of a certain type.
   * @param nameEntity the name of one of the six entities
   * @returns an array of all entities of a certain type
   */
  async getAll(
    nameEntity: NameEntity,
  ){
    let repository = this.chooseRepository(nameEntity);
    let relatedTables = this.selectRelatedTable(nameEntity);
    return await repository.find({relations: relatedTables});
  }

  /**
   * This method allows retrieving data about entities of a certain 
   * type on the specified page. The maximum number of entities per 
   * page is 10. Entities are sorted in reverse order.
   * @param nameEntity the name of one of the six entities
   * @param numberPage  the page number
   * @returns an array of objects (entities) with a maximum length of 10
   */
  async getSpecificPage(nameEntity: NameEntity, numberPage: number){
    let repository = this.chooseRepository(nameEntity);
    let relatedTables = this.selectRelatedTable(nameEntity);
    let allEntity = await repository.find({
      relations: relatedTables,
      order: {
        id: 'DESC'
      }
    });  
    let numberEntityOnPage = 10;
    if(Math.ceil(allEntity.length/numberEntityOnPage) < numberPage || numberPage < 0){
      throw new BadRequestException('Incorrect page');
    }

    let startIndex = numberEntityOnPage*(numberPage-1);
    let endIndex = allEntity.length > startIndex+numberEntityOnPage 
      ? startIndex+ numberEntityOnPage 
      : allEntity.length;
    
      return allEntity.slice(startIndex, endIndex)
  }

  /**
   * This method allows retrieving data about an entity with a specific identifier.
   * @param nameEntity the name of one of the six entities
   * @param id the identifier of the entity
   * @returns Data about the entity with a specific identifier
   */
  async getById(
    nameEntity: NameEntity,
    id: number
  ){
    let repository = this.chooseRepository(nameEntity);
    let relatedTables = this.selectRelatedTable(nameEntity);
    let entity = await repository.findOne({
      relations: relatedTables,
      where: {
        id: id
      }
    });   
    if(!entity){
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return entity;
  }

  /**
   * This method creates a string with entity data and adds it to the database.
   * @param entityDto data about the entity according to a specific template
   * @param nameEntity the name of one of the six entities
   * @returns  formatted data about the entity from the database
   */
  async createEntity(entityDto: Dto, nameEntity:NameEntity){
    let repository = this.chooseRepository(nameEntity);
    let entityIsExist = (await repository.findOne({where:{url: entityDto.url}})) != undefined;
    if(entityIsExist){
      throw new HttpException('Object already exists', HttpStatus.BAD_REQUEST);
    }

    const { homeworld, planets, characters, residents, pilots, people, films, species, vehicles, starships, ...entityData } = entityDto;

    const entity = repository.create(entityData);
    const savedEntity = await repository.save(entity);

    return await this.updateEntity(savedEntity.id, entityDto, nameEntity);
  }

  /**
   * This method updates data about an entity with a specific identifier.
   * @param entityId the identifier of the entity
   * @param dto the data for updating
   * @param nameEntity the name of one of the six entities
   * @returns formatted updated data about the entity from the database
   */
  async updateEntity(
    entityId:number, 
    dto: Dto,
    nameEntity: NameEntity
    ){
      let repository: MyRepository = this.chooseRepository(nameEntity)
      let entity = await repository.findOne(
        {
          where: {
            id: entityId
          },
          relations: this.selectRelatedTable(nameEntity)
        });
      if(!entity){
        throw new NotFoundException(`Entity with id ${entityId} not found`);
      }
      const { homeworld, planets, characters, residents, pilots, people, films, species, vehicles, starships, ...entityData } = dto;

      Object.assign(entity, entityData);

      if (homeworld && 'homeworld' in entity) {
        entity.homeworld = await this.addHomeworld(homeworld as string);
      }

      if(films && Array.isArray(films) /* && films.length !== 0*/ && 'films' in entity){
        entity.films =await this.getDataForEstablishRelationships(films, this.filmsRepository) as Films[];
      }
      if(species && Array.isArray(species)/* && species.length !== 0*/ && 'species' in entity){
        entity.species = await this.getDataForEstablishRelationships(species, this.speciesRepository);
      }
      if(vehicles && Array.isArray(vehicles) /*&& vehicles.length !== 0 */&& 'vehicles' in entity){
        entity.vehicles = await this.getDataForEstablishRelationships(vehicles, this.vehiclesRepository);
      }
      if(starships && Array.isArray(starships)/* && starships.length !== 0*/ && 'starships' in entity){
        entity.starships = await this.getDataForEstablishRelationships(starships, this.starshipsRepository);
      }

      if(planets && Array.isArray(planets)/* && planets.length !== 0*/ && 'planets' in entity){
        entity.planets = await this.getDataForEstablishRelationships(planets, this.planetsRepository);
      }
      if(characters && Array.isArray(characters)/* && characters.length !== 0*/ && 'characters' in entity){
        entity.characters = await this.getDataForEstablishRelationships(characters, this.peopleRepository) as People[];
      }
      if(residents && Array.isArray(residents)/* && residents.length !== 0*/ && 'residents' in entity){
        entity.residents = await this.getDataForEstablishRelationships(residents, this.peopleRepository) as People[];
      }
      if(pilots && Array.isArray(pilots)/* && pilots.length !== 0 */&& 'pilots' in entity){
        entity.pilots = await this.getDataForEstablishRelationships(pilots, this.peopleRepository) as People[];
      }
      if(people && Array.isArray(people)/* && people.length !== 0*/ && 'people' in entity){
        entity.people = await this.getDataForEstablishRelationships(people, this.peopleRepository) as People[];
      }

      await repository.save(entity)
      return entity;
  }

  /**
   * This method is for deleting data about an entity with a specific identifier.
   * @param entityId the identifier of the entity
   * @param nameEntity the name of one of the six entities
   * @returns the data that was deleted from the data table
   */
  async deleteEntity(
    entityId:number, 
    nameEntity: NameEntity
    ){
      let repository: MyRepository = this.chooseRepository(nameEntity)
      
      const entity = await repository.findOne({
        where: {id: entityId},
        relations: this.selectRelatedTable(nameEntity)
      });
      if (!entity) {
        throw new NotFoundException(`Entity with ID ${entityId} not found`);
      }
      if('homeworld' in entity) entity.homeworld = null;
      if('planets' in entity) entity.planets = []
      if('characters' in entity) entity.characters = [];
      if('residents' in entity) entity.residents = [];
      if('pilots' in entity) entity.pilots = [];
      if('people' in entity) entity.people = [];
      if('films' in entity) entity.films = [];
      if('species' in entity) entity.species = [];
      if('starships' in entity) entity.starships = [];
      if('vehicles' in entity) entity.vehicles = [];
      if('images' in entity) entity.images = [];
      await repository.save(entity);

      // Видаляємо основний запис
      return await repository.remove(entity);
  }

  /**
   * This method is for storing data about a specific image 
   * related to one of the six main entities.
   * @param imageNames the name of the image
   * @param entityId the identifier of the entity
   * @param nameEntity the name of one of the six entities
   * @returns the name of the image
   */
    async uploadImages(imageNames: string[], entityId:number, nameEntity:NameEntity) {
      let repository: MyRepository = this.chooseRepository(nameEntity)

      for(let imageName of imageNames){
        let entity = await repository.findOne(
          {
            where: {
              id: entityId
            },
            relations: ['images']
          });
        if(!entity){
          throw new NotFoundException(`Entity with id ${entityId} not found`);
        }
        let newImage = {
          name:imageName,
          [nameEntity.toLowerCase()]: entity
        }
        let image = await this.imagesRepository.create(newImage)
        await this.imagesRepository.save(image);
      }
      return imageNames;
    }


  /**
   * This method is for searching for an entity by its route.
   * @param url the route
   * @param repository тthe repository of the database table where data needs to be found
   * @returns the search result
   */
  async findByUrl(url: string, repository: MyRepository){
    return await repository.findOne({where: { url: url}})
  }

  /**
   * This method allows retrieving data for establishing relationships 
   * between database tables. Data is obtained either by searching using 
   * URL addresses (if available) or by creating new entities.
   * @param entitiesUrl an array of URL routes of entities for which data 
   * needs to be retrieved
   * @param repository the repository of the database table where data needs to be found
   * @returns an array of entity data
   */
  async getDataForEstablishRelationships (
    entitiesUrl: string[],
    repository: MyRepository
  ){

    if(entitiesUrl.length === 0){
      return [];
    }
    let entities = [];

    for (const url of entitiesUrl) {
      let entity = await this.findByUrl(url, repository);
      if(!entity){
        let newEntity = await repository.create({
            created: (new Date()).toISOString(),
            edited: (new Date()).toISOString(),
            url: url
          })
        entity = await repository.save(newEntity)
      }
      entities.push(entity);
    }

    return entities;
  }

  /**
   * This method is for adding/finding data about a native planet.
   * @param url the URL address of the planet
   * @returns data about the planet from the database
   */
  async addHomeworld(url: string){
    let planet = await this.findByUrl(url, this.planetsRepository);
    if (!planet) {      
      let newPlanet = await this.planetsRepository.create({
        created: (new Date()).toISOString(),
        edited: (new Date()).toISOString(),
        url: url
      })
      planet = await this.planetsRepository.save(newPlanet);
    }
    return planet;
  }

  /**
   * This method is for retrieving all images of an entity with a specific identifier.
   * @param entityId  the identifier of the entity
   * @param nameEntity the name of one of the six entities
   * @returns data about all images of a specific entity
   */
  async getAllImages(entityId:number, nameEntity: NameEntity){
    let repository: MyRepository = this.chooseRepository(nameEntity)
    let entity = await repository.findOne(
      {
        where: {
          id: entityId
        },
        relations: ['images']
      });
    if(!entity){
      throw new NotFoundException(`Entity with id ${entityId} not found`);
    }
    return entity.images;
  }

  /**
   * Method for retrieving a specific image of an entity with a specific identifier.
   * @param entityId the identifier of the entity
   * @param nameEntity the name of one of the six entities
   * @param imageId the identifier of the image
   * @returns data about the specific image
   */
  async getImageNameById(entityId:number, nameEntity: NameEntity, imageId:number){
    let nameColumn = `${nameEntity.toLowerCase()}`
    let image = await this.imagesRepository.findOne(
      {
        where: {
          id: imageId,
          [nameColumn]: entityId
        }
      });
    if(!image){
      throw new NotFoundException(`Image with id ${imageId} not found`);
    }
    return image.name;
  }

  /**
   * Method for deleting a specific image of an entity with a specific identifier.
   * @param entityId the identifier of the entity
   * @param nameEntity the name of one of the six entities
   * @param imageId the identifier of the image
   * @returns data about the deleted image
   */
  async deleteImageById(entityId:number, nameEntity: NameEntity, imageId:number){
    let nameColumn = `${nameEntity.toLowerCase()}`
    let image = await this.imagesRepository.findOne(
      {
        where: {
          id: imageId,
          [nameColumn]: entityId
        }
      });
    if(!image){
      throw new NotFoundException(`Image with id ${imageId} not found`);
    }
    await this.imagesRepository.delete(image);
    return image;
  }

  /**
   * Method for selecting a database table to work with according to the entity name.
   * @param nameEntity the name of one of the six entities
   * @returns a repository for working with a specific table
   */
  chooseRepository(
    nameEntity: NameEntity
  ): MyRepository{
    switch (nameEntity) {
      case 'People':
        return this.peopleRepository
      case 'Planets':
        return this.planetsRepository
      case 'Films':
        return this.filmsRepository
      case 'Species':
        return this.speciesRepository
      case 'Starships':
        return this.starshipsRepository
      case 'Vehicles':
        return this.vehiclesRepository
    }
  }

  /**
   * Method for retrieving the names of related database tables.
   * @param nameEntity the name of one of the six entities
   * @returns an array of names of related tables
   */
  selectRelatedTable(nameEntity: NameEntity | 'Images'){
    switch (nameEntity) {
      case 'People':
        return ['homeworld', 'films', 'species', 'vehicles', 'starships', 'images']
      case 'Planets':
        return ['residents', 'species', 'films', 'images']
      case 'Films':
        return ['characters', 'planets', 'starships', 'vehicles', 'species', 'images']
      case 'Species':
        return ['homeworld', 'people', 'films', 'images']
      case 'Starships':
        return ['pilots', 'films', 'images']
      case 'Vehicles':
        return ['pilots', 'films', 'images']
      case 'Images':
        return ['people', 'planets', 'films', 'species', 'starships', 'vehicles']
    }
  }

}
