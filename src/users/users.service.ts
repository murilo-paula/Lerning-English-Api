import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt'



@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(bodyUser: CreateUserDto) {
    try {
      const userIsExisting = await this.prisma.users.findUnique({
        where: {email: bodyUser.email},
      })

      if (userIsExisting) {
        throw new ConflictException('Email already registered');
      }

      const hashpassword = await bcrypt.hash(bodyUser.password, 10);

      const newUser = await this.prisma.users.create({
        data: {
          name: bodyUser.name,
          email: bodyUser.email,
          password: hashpassword,
        }
      })


      const {password, ...result} = newUser;

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      };
      throw new InternalServerErrorException("Internal error")
    }

  }

  async findEmail(email: string) {
    try {
      return await this.prisma.users.findUnique( { where: {email: email} } )
    } catch (error) {
      throw new InternalServerErrorException("findEmail error")
    }
  }

  async findAll() {
    try {
      const allUsers = this.prisma.users.findMany({select: {name: true, email: true} })

      

      return allUsers;
    } catch (error) {
      throw new InternalServerErrorException("find all users error")
    };
  }

  async findOne(id: number) {
    try {

      const userExisting = await this.prisma.users.findUnique({where: {id: id}, select: {name: true, email: true}});

      if (!userExisting) {throw new NotFoundException("User dont exist")};

      return userExisting;
    } catch (error) {
      if (error instanceof HttpException) {
        return error;
      }
      throw new InternalServerErrorException("find unique user error");
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
