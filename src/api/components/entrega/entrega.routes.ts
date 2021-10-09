import { Router } from "express";
import { body, checkSchema } from "express-validator";
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
      body("idPedido").exists(),
      body("nomeDestinatario").exists(),
      body("enderecoDestinatario").exists(),
      (req, res, next) => this.controller.iniciarEntrega(req, res, next)
    );
    this.router.post(
      "/baixa",
      body("codigoEntrega").exists(),
      body("usuario").exists(),
      body("latitude").exists(),
      body("longitude").exists(),
      body("observacao").exists(),
      (req, res, next) => this.controller.baixarEntrega(req, res, next)
    );
    this.router.get(
      "/:codigoEntrega",
      checkSchema({
        codigoEntrega: {
          in: ["params", "query"],
          errorMessage: "Parâmetro codigoEntrega inválido",
          isInt: true,
          toInt: true,
        },
      }),
      (req, res, next) => this.controller.consultarEntrega(req, res, next)
    );
    this.router.get("/ping", (req, res, next) =>
      this.controller.ping(req, res, next)
    );
  }
}
