import { Router } from 'express';

import { EntregaRoutes } from './entrega/entrega.routes';

export function registerApiRoutes(router: Router, prefix: string = ''): void {
	router.use(`${prefix}/entrega/`, new EntregaRoutes().router);
}