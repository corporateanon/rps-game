import { injectable } from 'inversify';
import { Score } from './models/Score';
import { ScoreStorage } from './ScoreStorage';

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
