import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(bodyUser: CreateUserDto) {
    try {
      const userIsExisting = await this.prisma.users.findUnique({
        where: {email: bodyUser.email},
      })

      if (!userIsExisting) {throw new ConflictException("Not register");}

      
    } catch (error) {
      
    }
    

    return ;
  }

  async findEmail(email: string) {
    try {
      return await this.prisma.users.findUnique( { where: {email: email} } )
    } catch (error) {
      throw new InternalServerErrorException("findEmail error")
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
