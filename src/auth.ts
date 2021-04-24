import  Verifier from 'verify-cognito-token';
import { Request, Response, NextFunction } from 'express';

export const validateCognitoToken = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.token) {
    res.sendStatus(401);
    return;
  }

  const verifier = new Verifier({
    region: 'us-east-1',
    userPoolId: 'us-east-1_hJrsBJIE5',
  });

  if (await verifier.verify(req.token)) {
    next();
  } else {
    res.sendStatus(401);
  }
};