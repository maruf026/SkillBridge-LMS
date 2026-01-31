
import type {Request, Response, NextFunction } from 'express';
import { auth as betterAuth } from '../lib/auth'

export enum UserRole {
    STUDENT = "STUDENT",
    TUTOR = "TUTOR",
    ADMIN = "ADMIN"
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                
            }
        }
    }
}

import { prisma } from "../lib/prisma";

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!",
        });
      }

      
      const userFromDb = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          isBanned: true,
          role: true,
          email: true,
          name: true,
        },
      });

      if (!userFromDb) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      if (userFromDb.isBanned) {
        return res.status(403).json({
          success: false,
          message: "Your account has been banned",
        });
      }

      req.user = {
        id: session.user.id,
        email: userFromDb.email,
        name: userFromDb.name,
        role: userFromDb.role,
      };

      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don't have permission",
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};


export default auth;