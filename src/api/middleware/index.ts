import { json, NextFunction, Request, Response, Router } from "express";
import cors from "cors";

export function registerMiddleware(router: Router): void {
  router.use(cors({ origin: "*" }));

  router.use(json());
}

export function registerErrorHandler(router: Router): Response | void {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    return res.status(500).json({
      error: err.message || err,
      status: 500,
    });
  });
}
