import { GameContext } from './GameContext';
import { Choices } from './models/Choices';

export interface GameActionChoice {
    type: 'GameActionChoice';
    payload: { choice: Choices };
}
export interface GameActionStart {
    type: 'GameActionStart';
}

export type GameAction = GameActionChoice | GameActionStart;

export type ActionHandler<Ctx extends GameContext> = (
    ctx: Ctx,
    action: GameAction
) => void;
