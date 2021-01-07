import { Request, Response } from 'express';
import { GameContext } from '../interfaces/GameContext';

export interface GameContextREST extends GameContext {
    req: Request;
    res: Response;
}
