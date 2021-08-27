import express from 'express'
import { initRestRoutes } from './routes';
import * as swaggerUi from 'swagger-ui-express';

export class Server {
    private readonly _app: express.Application = express()

    public constructor(){
        const swaggerDocument = require('../../swagger.json');

		this._app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
        initRestRoutes(this._app)
    }

    public get app(): express.Application{
        return this._app
    }
}