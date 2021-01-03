import { ProvenChoice } from '../models/ProvenChoice';

export interface ChoiceGenerator {
    getRandomChoice(): Promise<ProvenChoice>;
}
