import { ActionHandler } from './GameAction';
import { GameContext } from './GameContext';

export interface GameView<Ctx extends GameContext> {
    subscribe(handler: ActionHandler<Ctx>): void;
    askForChoice(ctx: Ctx): Promise<void>;
    showGameResult(ctx: Ctx): Promise<void>;
}
