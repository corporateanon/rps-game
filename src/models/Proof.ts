import { Choices } from './Choices';

export interface Proof {
    timestamp: number;
    salt: string;
    choiceStr: keyof typeof Choices;
}
