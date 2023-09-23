import { Controller, Dependencies, Bind, Get, Req, Render, Redirect } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
@Dependencies(ConfigService)
export class AppController {
    constructor(configService) {
        this.configService = configService;
    }

    @Get('/')
    @Redirect('/jeopardy', 302)
    index() {}

    @Get('/jeopardy')
    @Render('jeopardy/index')
    jeopardyLanding() {}

    @Get('/jeopardy/create')
    @Render('jeopardy/create')
    jeopardyCreate() {}

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

