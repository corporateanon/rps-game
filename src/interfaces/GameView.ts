import { ActionHandler } from './GameAction';
import { GameContext } from './GameContext';

export interface GameView<Ctx extends GameContext> {
    askForChoice(ctx: Ctx, dispatchAction: ActionHandler<Ctx>): Promise<void>;
    showGameResult(ctx: Ctx, dispatchAction: ActionHandler<Ctx>): Promise<void>;
}
