import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { APP_NAME, SECRET } from "../constants/env.js";
import { IToken } from "../interfaces/IToken.js";

type Scope =
  | string
  | ((request: Request) => string[] | string | undefined | null | true | false)

export function scope(...oneOf: [Scope, ...Scope[]]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) return next(new Error('Unauthorized'))

    const accessToken = req.headers.authorization.replace('Bearer ', '')

    jwt.verify(
      accessToken,
      SECRET,
      { audience: APP_NAME, issuer: APP_NAME },
      (err, payload) => {
        if (err) {
          console.error('Token verification error:', err);
          return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        if (typeof payload !== 'object' || typeof payload.sub !== 'string' || !Array.isArray(payload.scopes)) {
          return res.status(403).json({ error: 'Forbidden: Invalid token payload' });
        }

        req.token = payload as IToken

        if (req.token.role === 'sudo') return next();

        for (const pattern of oneOf) {
          if (typeof pattern === 'function') {
            const scope = pattern(req)

            if (scope === true) return next()

            if (!scope) continue

            if (!Array.isArray(scope)) {
              if (payload.scopes.includes(scope)) return next()
            }

            else for (const pattern of scope)
              if (payload.scopes.includes(pattern)) return next()
          }

          const scope = pattern

          if (!scope) continue

          if (payload.scopes.includes(scope)) return next()
        }

        return res.status(403).json({ error: 'Forbidden: Insufficient scope' })
      }
    )
  }
}
