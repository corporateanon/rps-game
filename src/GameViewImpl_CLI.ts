import { injectable } from 'inversify';
import { GameView } from './GameView';
import chalk from 'chalk';
import { Choices } from './models/Choices';
import inquirer from 'inquirer';
import { GameResult } from './models/Rules';
import { ProvenChoice } from './models/ProvenChoice';
import qs from 'querystring';

@injectable()
export class GameViewImpl_CLI implements GameView<null> {
    private getVerificationMessage(provenChoice: ProvenChoice): string {
        const onlineHashCheckURL = `https://api.hashify.net/hash/md5/hex?${qs.stringify(
            { value: provenChoice.proof }
        )}`;
        return `To verify my choice, check the MD5 hash of this string (without quotes): "${provenChoice.proof}". It should be equal to the hash i sent you before.
You can use an online service: ${onlineHashCheckURL}`;
    }

    async showGameResult(
        _ctx: null,
        result: GameResult,
        provenChoice: ProvenChoice
    ): Promise<void> {
        console.log(
            chalk`{bold My choice was: ${Choices[provenChoice.choice]}}`
        );

        switch (result.type) {
        case 'tie':
            {
                console.log(
                    chalk`{bold {blue ----------------------------------------}}`
                );
                console.log(
                    chalk`{bold {blue  The game is tied. Let's play again.}}`
                );
                console.log(
                    chalk`{bold {blue ----------------------------------------}}`
                );

                console.log(
                    chalk.dim(this.getVerificationMessage(provenChoice))
                );
            }
            break;
        case 'iWon':
            {
                console.log(result.message);
                console.log(
                    chalk`{bold {red -----------------------------}}`
                );
                console.log(
                    chalk`{bold {red  I won! Try again next time.}}`
                );
                console.log(
                    chalk`{bold {red -----------------------------}}`
                );
                console.log(
                    chalk.dim(this.getVerificationMessage(provenChoice))
                );
            }
            break;
        case 'theyWon':
            {
                console.log(result.message);
                console.log(
                    chalk`{bold {green ----------------------------------------}}`
                );
                console.log(
                    chalk`{bold {green  Congratulations!!! You are the winner!}}`
                );
                console.log(
                    chalk`{bold {green ----------------------------------------}}`
                );
            }
            break;
        default:
            break;
        }
        console.log('\n');
    }

    async askForChoice(_ctx: null, hash: string): Promise<Choices> {
        console.log(
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
        return choice;
    }

    async showMessage(_ctx: null, message: string): Promise<void> {
        console.log(message);
    }
}
