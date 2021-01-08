import { inject, injectable } from 'inversify';
import { Score } from './models/Score';
import { ScoreStorage } from './interfaces/ScoreStorage';
import { Redis } from 'ioredis';
import { DI } from './DI';

/**
 * ShoreStorage allows to store the game score.
 * Its methods are asynchronous in order to make the interface more general.
 * In case of memory storage, the asynchronicity is not needed, but if
 * we write a database-driven implementation, it is mandatory.
 */
@injectable()
export class ScoreStorageImpl_Redis implements ScoreStorage {
    constructor(@inject(DI.Redis) private redis: Redis) {}

    readonly COMP_KEY = 'rps-game:score:computer';
    readonly HUMAN_KEY = 'rps-game:score:human';
    async increaseComputerScore(): Promise<void> {
        await this.redis.incr(this.COMP_KEY);
    }
    async increaseHumanScore(): Promise<void> {
        await this.redis.incr(this.HUMAN_KEY);
    }
    async getScore(): Promise<Score> {
        const [comp, human] = await this.redis.mget(
            this.COMP_KEY,
            this.HUMAN_KEY
        );

        return {
            computerWinsCount: parseInt(comp ?? '0') || 0,
            humanWinsCount   : parseInt(human ?? '0') || 0,
        };
    }
}
