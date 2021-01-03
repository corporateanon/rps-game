import { ProvenChoice } from '../models/ProvenChoice';
import { GameResult } from '../models/Rules';
import { Score } from '../models/Score';

export interface GameContext {
    provenChoice?: ProvenChoice;
    score?: Score;
    gameResult?: GameResult;
}
