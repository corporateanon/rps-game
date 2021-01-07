import { AxiosInstance } from 'axios';

export interface Score {
    readonly computerWinsCount: number;
    readonly humanWinsCount: number;
}
export enum Choices {
    Rock = 0,
    Scissors,
    Paper,
    LEN,
}
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

export class APIClient {
    constructor(private http: AxiosInstance) {}

    async startGame(): Promise<AskForChoiceResponse> {
        const { data } = await this.http.post('/start');
        return data;
    }

    async makeChoice(choice: Choices): Promise<ShowGameResultResponse> {
        const { data } = await this.http.post(
            `/choice/${Choices[choice].toLowerCase()}`
        );
        return data;
    }
}
