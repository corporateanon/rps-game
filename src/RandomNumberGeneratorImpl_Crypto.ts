import { randomInt } from 'crypto';
import { injectable } from 'inversify';
import { RandomNumberGenerator } from './interfaces/RandomNumberGenerator';

@injectable()
export class RandomNumberGeneratorImpl_Crypto implements RandomNumberGenerator {
    getRandomInteger(min: number, max: number): Promise<number> {
        return new Promise((resolve, reject) => {
            // crypto.randomInt is cryptografically strong random numbers generator
            // See: https://nodejs.org/api/crypto.html#crypto_crypto_randomint_min_max_callback
            randomInt(min, max, (err, value) =>
                err ? reject(err) : resolve(value)
            );
        });
    }
}
