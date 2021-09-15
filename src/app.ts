import express from 'express';
import { Server } from './api/server';
import { createServer, Server as HttpServer } from 'http';
import { env } from './config/globals';
import "reflect-metadata";
import {Connection, createConnection} from "typeorm";

(async function main() {
	try {

        // Connect db
        const connection: Connection = await createConnection();

		await connection.runMigrations();

		// Init express server
		const app: express.Application = new Server().app;
		
		const server: HttpServer = createServer(app);


		// Start express server
		server.listen(env.NODE_PORT);

		server.on('listening', () => {
			console.log(`node server is listening on port ${env.NODE_PORT} in development mode`);
		});

		server.on('close', () => {
            connection.close();
			console.log('node server closed');
		});
	} catch (err) {
		console.log(err.stack);
	}
})();
