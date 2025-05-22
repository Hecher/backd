import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { JwtPayload } from "./interface/jwt-payloader.interface";

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findOne(username);
        if( user && await user.validatePassword(password)){
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(LoginDto: LoginDto) {
        const { username, password } = LoginDto;
        const user = await this.userService.findOne(username);

        if (!user || !(await user.validatePassword(password))) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const payload: JwtPayload = { username: user.username, sub: user.id};
        return {
            accessToken: this.jwtService.sign(payload)
        }
    }
}