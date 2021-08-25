import { Router } from "express";
import { body } from "express-validator";
import { IComponentRoutes } from "../helper";
import { EntregaController } from "./entrega.controller";
import { EntregaFactory } from "./entrega.factory";
import { IEntregaService, EntregaService } from "./entrega.service";

export class EntregaRoutes implements IComponentRoutes<EntregaController> {
  entregaService: IEntregaService = EntregaFactory.makeEntregaService();
  name: string = "entrega";
  controller = new EntregaController(this.entregaService);
  router: Router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.post(
      "/entrada",
      body("armazem").exists(),
      body("cliente").exists(),
      body("produto").exists(),
      body("nomeDestinatario").exists(),
      body("enderecoDestinatario").exists(),
      (req, res, next) => this.controller.iniciarEntrega(req, res, next)
    );
    this.router.get("/ping",(req, res, next) =>this.controller.ping(req,res,next))
  }
}
