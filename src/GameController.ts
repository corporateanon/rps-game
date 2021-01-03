import { inject, injectable } from 'inversify';
import { DI } from './DI';
import { ChoiceGenerator } from './interfaces/ChoiceGenerator';
import { GameAction } from './interfaces/GameAction';
import { GameContext } from './interfaces/GameContext';
import { GameView } from './interfaces/GameView';
import { ScoreStorage } from './interfaces/ScoreStorage';
import { Choices } from './models/Choices';
import { getGameResult } from './models/Rules';
import { assertDefined } from './utils/assertDefined';

/**
 * GameController incapsulates business logic.
 * It can call GameView's methids in order to render game state
 * and provide the view with dispatchAction callback in order to listen to user's interaction.
 *
 * GameController is intentionally made stateless.
 * The entire game state is handled through calls in `ctx` parameter.
 *
 * In future it will allow to substitute a GameView interface with
 * an implementation which is independent on process life cycle.
 * For example, it can be a RESTful API.
 *
 * In the latter case, a context will also have `req` and `res` properties
 * for HTTP request and response accordingly.
 * The idea is that the application could be turned into a web-application
 * or a chat-bot or whatever by only replacing a view, without a need to touch the GameController.
 */

@injectable()
export class GameController<Ctx extends GameContext> {
    constructor(
        @inject(DI.GameView) private view: GameView<Ctx>,
        @inject(DI.ChoiceGenerator) private choiceGenerator: ChoiceGenerator,
        @inject(DI.ScoreStorage) private storage: ScoreStorage
    ) {}

    /**
     * React to user interactions triggered by view
     */
    public dispatchAction = (ctx: Ctx, action: GameAction): void => {
        switch (action.type) {
        case 'GameActionStart':
            this.start(ctx);
            break;
        case 'GameActionChoice':
            {
                const { provenChoice } = ctx;
                assertDefined(provenChoice);
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
        const provenChoice = await this.choiceGenerator.getRandomChoice();
        await this.view.askForChoice(
            { ...ctx, provenChoice },
            this.dispatchAction
        );
    }
}
