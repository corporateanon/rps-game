import { randomInt } from 'crypto';
import { injectable } from 'inversify';
import { RandomNumberGenerator } from './RandomNumberGenerator';

@injectable()
export class RandomNumberGeneratorImpl_Crypto implements RandomNumberGenerator {
    getRandomInteger(min: number, max: number): Promise<number> {
        return new Promise((resolve, reject) => {
            randomInt(min, max, (err, value) =>
                err ? reject(err) : resolve(value)
            );
        });
    }
}
