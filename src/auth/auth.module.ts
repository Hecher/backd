import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: 'admin',
            signOptions: { expiresIn: '1h'}
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}