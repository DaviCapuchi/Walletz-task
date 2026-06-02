import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response, Request } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

res.on('finish', () => {
    const tempo = Date.now() - start;

    console.log(`${req.method} ${req.url} - ${tempo}ms`);
});

    next();
}
}