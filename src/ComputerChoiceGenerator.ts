import { inject, injectable } from 'inversify';
import { DI } from './DI';
import { Choices } from './models/Choices';
import { ProvenChoice } from './models/ProvenChoice';
import { RandomNumberGenerator } from './interfaces/RandomNumberGenerator';
import md5 from 'md5';

/**
 * ComputerChoiceGenerator generates a signed choice.
 *
 * A computer may choose any of Rock, Scissors or Paper.
 * But in order to verify that the computer's choice was truly blind
 * and made really before the user's choice, we provide a user with
 * MD5 hash of computer's choice (along with timestamp and salt).
 *
 * After the game has ended, a user can calculate MD5 hash of the
 * computer's choice and make sure the computers played fair.
 */
@injectable()
export class ComputerChoiceGenerator {
    constructor(
        @inject(DI.RandomNumberGenerator)
        private rng: RandomNumberGenerator
    ) {}
    public async getRandomChoice(): Promise<ProvenChoice> {
        const salt = (await this.rng.getRandomInteger(0, 4e6)).toString(36);
        const timestamp = Date.now();
        const choice = await this.rng.getRandomInteger(0, Choices.LEN);
        const choiceStr = Choices[choice];
        const proof = `${timestamp}-${salt}-${choiceStr}`;
        const hash = md5(proof);

        return { choice, hash, proof };
    }
}
