import chalk from 'chalk';
import inquirer from 'inquirer';
import { inject, injectable } from 'inversify';
import qs from 'querystring';
import { assertDefined } from './utils/assertDefined';
import { DI } from './DI';
import { ActionHandler } from './interfaces/GameAction';
import { GameContext } from './interfaces/GameContext';
import { GameView } from './interfaces/GameView';
import { Logger } from './interfaces/Logger';
import { Choices } from './models/Choices';
import { ProvenChoice } from './models/ProvenChoice';
import { Score } from './models/Score';

@injectable()
export class GameViewImpl_CLI implements GameView<GameContext> {
    constructor(@inject(DI.Logger) private logger: Logger) {}

    private formatVerificationMessage(provenChoice: ProvenChoice): string {
        const onlineHashCheckURL = `https://api.hashify.net/hash/md5/hex?${qs.stringify(
            { value: provenChoice.proof }
        )}`;
        return `To verify my choice, check the MD5 hash of this string (without quotes): "${provenChoice.proof}". It should be equal to the hash i sent you before.
You can use an online service: ${onlineHashCheckURL}`;
    }

    private formatScore(score: Score): string {
        const { computerWinsCount: computer, humanWinsCount: human } = score;

        const leadMessage =
            computer > human
                ? 'I am leading'
                : human > computer
                    ? 'You are leading'
                    : 'We have a draw';

        return chalk`Score board:
    Computer: {bold ${computer}}
    Human   : {bold ${human}}
    ${leadMessage}`;
    }

    async showGameResult(
        ctx: GameContext,
        dispatchAction: ActionHandler<GameContext>
    ): Promise<void> {
        const { gameResult, provenChoice, score } = ctx;
        assertDefined(provenChoice);
        assertDefined(gameResult);
        assertDefined(score);

        this.logger.log(
            chalk`{bold My choice was: ${Choices[provenChoice.choice]}}`
        );

        switch (gameResult.type) {
        case 'tie':
            {
                this.logger.log(
                    chalk`{bold {blue ----------------------------------------}}`
                );
                this.logger.log(
                    chalk`{bold {blue  The game is tied. Let's play again.}}`
                );
                this.logger.log(
                    chalk`{bold {blue ----------------------------------------}}`
                );

                this.logger.log(
                    chalk.dim(this.formatVerificationMessage(provenChoice))
                );
            }
            break;
        case 'iWon':
            {
                if (gameResult.message) {
                    this.logger.log(gameResult.message);
                }
                this.logger.log(
                    chalk`{bold {red -----------------------------}}`
                );
                this.logger.log(
                    chalk`{bold {red  I won! Try again next time.}}`
                );
                this.logger.log(
                    chalk`{bold {red -----------------------------}}`
                );
                this.logger.log(
                    chalk.dim(this.formatVerificationMessage(provenChoice))
                );
            }
            break;
        case 'theyWon':
            {
                if (gameResult.message) {
                    this.logger.log(gameResult.message);
                }
                this.logger.log(
                    chalk`{bold {green ----------------------------------------}}`
                );
                this.logger.log(
                    chalk`{bold {green  Congratulations!!! You are the winner!}}`
                );
                this.logger.log(
                    chalk`{bold {green ----------------------------------------}}`
                );
            }
            break;
        default:
            break;
        }
        this.logger.log(this.formatScore(score));

        this.logger.log('\n');

        dispatchAction(ctx, { type: 'GameActionStart' });
    }

    async askForChoice(
        ctx: GameContext,
        dispatchAction: ActionHandler<GameContext>
    ): Promise<void> {
        const provenChoice = ctx.provenChoice;

        assertDefined(provenChoice);
        const { hash } = provenChoice;

        this.logger.log(
            chalk`I made my move. You will be able to verify it later using the following hash:
  {bold ${hash}}`
        );
        const { choice } = await inquirer.prompt([
            {
                name   : 'choice',
                type   : 'list',
                message: 'Your choice',
                choices: [
                    {
                        name : 'Rock',
                        value: Choices.Rock,
                    },
                    {
                        name : 'Paper',
                        value: Choices.Paper,
                    },
                    {
                        name : 'Scissors',
                        value: Choices.Scissors,
                    },
                ],
            },
        ]);
        dispatchAction(ctx, { type: 'GameActionChoice', payload: { choice } });
    }
}
