import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { Entrega } from "../../../entity/Entrega";
import { DomainError, DomainErrorCode } from "../helper";
import { BaixaEntrega } from "./entrega.model";
import { IEntregaService } from "./entrega.service";

export class EntregaController {
  private entregaService: IEntregaService = undefined;

  constructor(localizacaoService: IEntregaService) {
    this.entregaService = localizacaoService;
  }

  public async iniciarEntrega(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const entregaIniciar: Entrega = req.body;
      const entregaIniciada = await this.entregaService.iniciarEntrega(
        entregaIniciar
      );

      return res.json(entregaIniciada);
    } catch (err) {
      if (err instanceof DomainError && err.Code == DomainErrorCode.ProdutoNaoInformado){
        res.statusCode = 400
        return res.send(err.Message);
      }
      return next(err);
    }
  }

  public async consultarEntrega(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const codigoEntrega = parseInt(req.params.codigoEntrega);
      const entregaLocalizada = await this.entregaService.consultarEntrega(codigoEntrega);
      return res.json(entregaLocalizada);
    } catch (error) {
      if (error instanceof DomainError && error.Code == DomainErrorCode.EntregaNaoLocalizada){
        res.statusCode = 404;
        return res.send(error.Message);
      }
      return next(error);
    }
  }

  public async baixarEntrega(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>{
    try {
      const baixaEntrega: BaixaEntrega = req.body;
      const entregaBaixada = await this.entregaService.baixarEntrega(baixaEntrega);
      return res.json(entregaBaixada);
    } 
    catch (error) {
      if (error instanceof DomainError){
        if (error.Code == DomainErrorCode.EntregaNaoLocalizada){
          res.statusCode = 404;
          return res.send(error.Message);
        }else if (error.Code == DomainErrorCode.EntregaJaBaixada){
          res.statusCode = 400;
          return res.send(error.Message);
        }
      }
      return next(error);
    }
  }

  public async ping(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    res.json({ ping: "ok" });
  }
}
