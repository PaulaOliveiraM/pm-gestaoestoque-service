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


/**
 * TODO: 
 * 	1- Implementar todas as entidades com os seus respectivos relacionamentos - OK
 *  2- Criar os repositories e services necessários para implementar os endpoints: /entrega/entrada (post), /entrega/<codigoEntrega> (get), (post) /entrega/baixa
 * 	   de preferência fazer a implementação dos repositories conforme os endpoints vão sendo montados.
 *  3- Implementar o swagger
 *  4- Implementar os testes
 * 
 */