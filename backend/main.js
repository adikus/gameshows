import { join } from 'path';

import cookieParser from 'cookie-parser';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const { PORT = 3000 } = process.env;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useStaticAssets(join(__dirname, '..', 'public'));
    if (process.env.NODE_ENV === "production") {
        app.useStaticAssets(join(__dirname, '..', 'dist'));
    }
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('hbs');

    app.use(cookieParser());

    await app.listen(PORT);
}
bootstrap();
