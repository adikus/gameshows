import { Controller, Dependencies, Bind, Get, Req, Render, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
@Dependencies(AppService, ConfigService)
export class AppController {
    constructor(appService, configService) {
        this.appService = appService;
        this.configService = configService;
    }

    @Get()
    @Render('index')
    getHello() {
        return { message: this.appService.getHello() };
    }

    @Get(['/frontend/*', '/node_modules/*', '/@vite/*'])
    @Redirect()
    @Bind(Req())
    assetsRedirect(req) {
        return {
            statusCode: 303,
            url: `http://localhost:${this.configService.get('ASSETS_PORT')}${req.baseUrl}${req.path}`
        }
    }
}

