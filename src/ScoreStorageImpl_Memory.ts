import { injectable } from 'inversify';
import { Score } from './models/Score';
import { ScoreStorage } from './interfaces/ScoreStorage';

/**
 * ShoreStorage allows to store the game score.
 * Its methods are asynchronous in order to make the interface more general.
 * In case of memory storage, the asynchronicity is not needed, but if
 * we write a database-driven implementation, it is mandatory.
 */
@injectable()
export class ScoreStorageImpl_Memory implements ScoreStorage {
    private score: Score = {
        computerWinsCount: 0,
        humanWinsCount   : 0,
    };

    async increaseComputerScore(): Promise<void> {
        this.score = {
            ...this.score,
            computerWinsCount: this.score.computerWinsCount + 1,
        };
    }
    async increaseHumanScore(): Promise<void> {
        this.score = {
            ...this.score,
            humanWinsCount: this.score.humanWinsCount + 1,
        };
    }
    async getScore(): Promise<Score> {
        return this.score;
    }
}
