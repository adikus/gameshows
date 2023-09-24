import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonVariablesMiddleware {
    use(req, res, next) {
        res.locals.baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        next();
    }
}
