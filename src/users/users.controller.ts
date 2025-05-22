import { Controller, Post, Body, Get, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetUser } from "../auth/decorator/get-user.decorator"
import { User } from "./user.entity";

@Controller('users')
export class UsersController {
    constructor (private usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@GetUser() user: User) {
        return user;
    }

}
