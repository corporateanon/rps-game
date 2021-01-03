import { Choices } from './Choices';

const rules = [
    {
        winner : Choices.Paper,
        loser  : Choices.Rock,
        message: 'Paper covers rock',
    },
    {
        winner : Choices.Rock,
        loser  : Choices.Scissors,
        message: 'Rock crashes scissors',
    },
    {
        winner : Choices.Scissors,
        loser  : Choices.Paper,
        message: 'Scissors cuts paper',
    },
];

export type ResultType = 'iWon' | 'theyWon' | 'tie';

export interface GameResult {
    type: ResultType;
    message?: string;
}

export function getGameResult(
    myChoice: Choices,
    theirChoice: Choices
): GameResult {
    if (myChoice === theirChoice) {
        return {
            type: 'tie',
        };
    }
    for (const rule of rules) {
        if (myChoice === rule.winner && theirChoice === rule.loser) {
            return {
                type   : 'iWon',
                message: rule.message,
            };
        }
        if (myChoice === rule.loser && theirChoice === rule.winner) {
            return {
                type   : 'theyWon',
                message: rule.message,
            };
        }
    }
    //It will never happen because we have tried all combinations
    throw new Error('Undetermined game result');
}
