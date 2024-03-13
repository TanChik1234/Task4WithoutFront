
import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from 'dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Blocktoken } from 'src/entities/blocktoken.entity';



@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,

    @Inject('BLOCKTOKEN_REPOSITORY')
    private tokenRepository: Repository<Blocktoken>
  ){}


  /**
   * Checks user data and its presence in the database
   * @param user User data: name and password
   * @returns User data from the database: name, password, role
   */
  async signIn(user: SignInDto){
    const existingUser = await this.userRepository.findOne({
      where: {
        username: user.username
      }
    })
   
    if(!existingUser || !(await bcrypt.compare(user.password, existingUser.password ))){
      throw new UnauthorizedException('Invalid username or password');
    }

    return existingUser;
  }

  /**
   * Gets data of a new user, checks if a user with such a name exists, if not,
   * adds the data to the data table and returns them
   * @param user User data: name and password
   * @returns  Saved data from the database about the user: name, password, role
   */
  async register(user: SignInDto){
    const existingUser = await this.userRepository.find({where:{username: user.username}});
    console.log(JSON.stringify(existingUser));
    if (existingUser && existingUser.length != 0) {
      throw new ConflictException('Username already exists');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);
    let userData = await this.userRepository.create({
      username: user.username,
      password: hashedPassword,
      role: 'user'
    });

    return await this.userRepository.save(userData);
  }

  async addTokenToDB(token:string){
    let tokenData = await this.tokenRepository.create({token: token});
    return await this.tokenRepository.save(tokenData);
  }

  async isTokenBlock(token:string){
    let tokenData = await this.tokenRepository.findOne({
      where: {
        token: token
      }
    })
    if(tokenData){
      return true;
    }
    return false
  }
}
