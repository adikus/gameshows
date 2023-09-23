import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ManifestMiddleware } from './manifest.middleware'

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [AppController],
})
export class AppModule {
    configure(consumer) {
        consumer
            .apply(ManifestMiddleware)
            .forRoutes({ path: "*", method: RequestMethod.ALL });
    }
}
