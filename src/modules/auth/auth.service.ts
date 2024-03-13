import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto } from 'dto/signin.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    ) {}

    /**
     * This method implements the logic for checking login data against the database
     * and generates an access token if the provided data is correct.
     * @param user  login data: username and password
     * @returns   a security token as a string
     */
  async signIn(user: SignInDto): Promise<any> {
    const resultSingIn = await this.usersService.signIn(user);
    const { password, ...result } = resultSingIn;
    const payload = { sub: resultSingIn.id, username: resultSingIn.username, role: resultSingIn.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

    /**
     * This method implements the logic for adding user data to the database and 
     * creates a token access upon successful registration.
     * @param user registration data: username and password
     * @returns a security token as a string
     */
  async register(user: SignInDto){
    const resultRegister = await this.usersService.register(user);
    const { password, ...result } = resultRegister;
    const payload = { sub: resultRegister.id, username: resultRegister.username, role: resultRegister.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  /**
   * This method implements the logic for logging out by adding the current 
   * access token to the table with blocked logins.
   * @param token  access token
   * @returns a message indicating successful logout
   */
  async logOut(token:string){
    try {
      await this.usersService.addTokenToDB(token);
      return {message: "Log out successfuly"}
    } catch (error) {
      throw new ForbiddenException('Logout is not allowed in this context');
    }
  }
}

