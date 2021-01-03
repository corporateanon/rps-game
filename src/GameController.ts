import { inject, injectable } from 'inversify';
import { DI } from './DI';
import { Draw } from './Draw';
import { GameView } from './GameView';
import { getGameResult } from './models/Rules';

@injectable()
export class GameController<Ctx> {
    constructor(
        @inject(DI.GameView) private view: GameView<Ctx>,
        @inject(Draw) private draw: Draw
    ) {}

    public async start(ctx: Ctx): Promise<void> {
        for (;;) {
            const provenChoice = await this.draw.getRandomChoice();
            const playerChoice = await this.view.askForChoice(
                ctx,
                provenChoice.hash
            );
            const gameResult = getGameResult(provenChoice.choice, playerChoice);
            await this.view.showGameResult(ctx, gameResult, provenChoice);
        }
    }
}
