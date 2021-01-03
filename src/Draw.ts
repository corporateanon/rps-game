import { inject, injectable } from 'inversify';
import { DI } from './DI';
import { Choices } from './models/Choices';
import { ProvenChoice } from './models/ProvenChoice';
import { RandomNumberGenerator } from './interfaces/RandomNumberGenerator';
import md5 from 'md5';

@injectable()
export class Draw {
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
