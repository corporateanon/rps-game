export interface RandomNumberGenerator {
    getRandomInteger(min: number, max: number): Promise<number>;
}
