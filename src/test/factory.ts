import "reflect-metadata";

process.env.NODE_ENV = "test";

import { config } from "dotenv";
config();

import { Connection, ConnectionOptions, createConnection } from "typeorm";
import { createServer, Server as HttpServer } from "http";

import express from "express";
import supertest from "supertest";

import { env } from "../config/globals";

import { Server } from "../api/server";

export class TestFactory {
  private _app: express.Application;
  private _connection: Connection;
  private _server: HttpServer;

  // DB connection options
  private options: ConnectionOptions = {
    type: "sqljs",
    database: new Uint8Array(),
    location: "database",
    logging: false,
    synchronize: true,
    entities: ["build/entity/*.js"],
    migrations: ["build/migration/**/*.js"],
    cli: {
      migrationsDir: "build/migration",
    },
  };

  public get app(): supertest.SuperTest<supertest.Test> {
    return supertest(this._app);
  }

  public get connection(): Connection {
    return this._connection;
  }

  public get server(): HttpServer {
    return this._server;
  }

  public async init(): Promise<void> {
    await this.startup();
  }

  public async close(): Promise<void> {
    this._server.close();
    this._connection.close();
  }

  private async startup(): Promise<void> {
    this._connection = await createConnection(this.options);
    await this._connection.runMigrations();

    this._app = new Server().app;
    this._server = createServer(this._app).listen(env.NODE_PORT);
  }
}
