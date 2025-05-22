import { Injectable, ConflictException, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) 
        private usersRepository: Repository<User>
    ) {}

    async findOne(username: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { username } });
    }

    async findById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({where: { id }});
    }

    async create(CreateUserDto: CreateUserDto): Promise<User>{
        const {username, email, password} = CreateUserDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.usersRepository.create({
            username,
            email,
            password: hashedPassword,
        });

        try {
            await this.usersRepository.save(user);
            return user;
        } catch (error) {
            if(error.code === '23505') {
                throw new ConflictException('Username or email already exists');
            } else { 
                throw new InternalServerErrorException();
            }
        }
        
    }

}