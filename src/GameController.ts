import { inject, injectable } from 'inversify';
import { DI } from './DI';
import { Draw } from './Draw';
import { GameView } from './GameView';
import { getGameResult } from './models/Rules';
import { ScoreStorage } from './ScoreStorage';

@injectable()
export class GameController<Ctx> {
    constructor(
        @inject(DI.GameView) private view: GameView<Ctx>,
        @inject(Draw) private draw: Draw,
        @inject(DI.ScoreStorage) private storage: ScoreStorage
    ) {}

    public async start(ctx: Ctx): Promise<void> {
        for (;;) {
            const provenChoice = await this.draw.getRandomChoice();
            const playerChoice = await this.view.askForChoice(
                ctx,
                provenChoice.hash
            );
            const gameResult = getGameResult(provenChoice.choice, playerChoice);
            if (gameResult.type === 'iWon') {
                await this.storage.increaseComputerScore();
            }
            if (gameResult.type === 'theyWon') {
                await this.storage.increaseHumanScore();
            }
            //TODO: display score in view
            await this.view.showGameResult(ctx, gameResult, provenChoice);
        }
    }
}
