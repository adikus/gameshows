const fs = require('fs');
const path = require("path");

import { Injectable } from '@nestjs/common';

@Injectable()
export class ManifestMiddleware {
    constructor() {
        const manifestFile = path.join(__dirname, '../dist/manifest.json');

        if (process.env.NODE_ENV === "production" && fs.existsSync(manifestFile)) {
            const manifestContents = JSON.parse(fs.readFileSync(manifestFile).toString());
            this.manifest = {
                scripts: [manifestContents['frontend/main.js']['file']],
                stylesheets: manifestContents['frontend/main.js']['css']
            };
        }
    }

    use(req, res, next) {
        res.locals.manifest = this.manifest;
        next();
    }
}
