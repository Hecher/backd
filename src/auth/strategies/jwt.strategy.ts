import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UsersService } from "../../users/users.service";
import { JwtPayload } from '../interface/jwt-payloader.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'admin',
        });
    }
    async validate(payloader: JwtPayload) {
        const user = await this.usersService.findById(payloader.sub);
        if(!user) {
            throw new UnauthorizedException;
        }
        return user;
    }
}