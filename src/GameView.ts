import { Choices } from './models/Choices';
import { ProvenChoice } from './models/ProvenChoice';
import { GameResult } from './models/Rules';

export interface GameView<Ctx> {
    showMessage(ctx: Ctx, message: string): Promise<void>;
    askForChoice(ctx: Ctx, hash: string): Promise<Choices>;
    showGameResult(
        ctx: Ctx,
        result: GameResult,
        provenChoice: ProvenChoice
    ): Promise<void>;
}
