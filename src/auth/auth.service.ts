import { ConflictException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}


  async create(body: CreateAuthDto) {
    return await this.usersService.create(body);
  }


  async login(body: LoginAuthDto) {
    try {
      const {password, email} = body;

      const user = await this.usersService.findEmail(email);

      if (!user) {throw new UnauthorizedException("Not authorized")};

      const passwordHashed = await bcrypt.compare(password, user.password)

      if (!passwordHashed) {throw new UnauthorizedException("your not is authorized")}

      const payload = { sub: user.id, email: user.email}

      const accesstoken = await this.jwtService.signAsync(payload)

      return accesstoken

    } catch (error) {
      if (error instanceof HttpException) {throw error}
      throw new InternalServerErrorException("Internal error")
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
