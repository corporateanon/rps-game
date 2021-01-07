import { Score } from '../models/Score';

export interface AskForChoiceResponse {
    message: string;
    comment: string;
    computerChoiceHash: string;
}

export interface ShowGameResultResponse {
    result: string;
    message: string;
    comment: string;
    proof: string;
    proofLink: string;
    scoreBoard: Score;
}

export interface ErrorResponse {
    error: string;
    comment?: string;
}
