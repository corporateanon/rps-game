import { AxiosInstance } from 'axios';
import { Choices } from '../lib/models/Choices';
import {
    AskForChoiceResponse,
    ShowGameResultResponse,
} from '../lib/rest/Responses';

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
