import { inject, injectable } from 'inversify';
import { assertDefined } from './assertDefined';
import { DI } from './DI';
import { Draw } from './Draw';
import { GameAction } from './GameAction';
import { GameContext } from './GameContext';
import { GameView } from './GameView';
import { Choices } from './models/Choices';
import { getGameResult } from './models/Rules';
import { ScoreStorage } from './ScoreStorage';

@injectable()
export class GameController<Ctx extends GameContext> {
    constructor(
        @inject(DI.GameView) private view: GameView<Ctx>,
        @inject(Draw) private draw: Draw,
        @inject(DI.ScoreStorage) private storage: ScoreStorage
    ) {}

    public dispatchAction = (ctx: Ctx, action: GameAction): void => {
        switch (action.type) {
        case 'GameActionStart':
            this.start(ctx);
            break;
        case 'GameActionChoice':
            {
                const { provenChoice } = ctx;
                if (!provenChoice) {
                    throw new Error('Invalid game state');
                }
                this.handleChoiceAction(
                    { ...ctx, provenChoice },
                    action.payload.choice
                );
            }
            break;
        }
    };

    private async handleChoiceAction(
        ctx: Ctx,
        playerChoice: Choices
    ): Promise<void> {
        const { provenChoice } = ctx;
        assertDefined(provenChoice);

        const gameResult = getGameResult(provenChoice.choice, playerChoice);
        if (gameResult.type === 'iWon') {
            await this.storage.increaseComputerScore();
        }
        if (gameResult.type === 'theyWon') {
            await this.storage.increaseHumanScore();
        }
        const score = await this.storage.getScore();

        await this.view.showGameResult(
            { ...ctx, gameResult, score, provenChoice },
            this.dispatchAction
        );
    }

    public async start(ctx: Ctx): Promise<void> {
        const provenChoice = await this.draw.getRandomChoice();
        await this.view.askForChoice(
            { ...ctx, provenChoice },
            this.dispatchAction
        );
    }
}
