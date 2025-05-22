import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 7891,
    username: 'postgres',
    password: 'postgres',
    database: 'diplom',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true
}