import { Score } from './models/Score';

export interface ScoreStorage {
    increaseComputerScore(): Promise<void>;
    increaseHumanScore(): Promise<void>;
    getScore(): Promise<Score>;
}
