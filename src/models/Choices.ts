export enum Choices {
    Rock = 0,
    Scissors,
    Paper,
    LEN,
}

export const choiceStrToChoice = (choiceStr: string): Choices | null => {
    switch (choiceStr.toLowerCase()) {
    case 'rock': {
        return Choices.Rock;
    }
    case 'scissors': {
        return Choices.Scissors;
    }
    case 'paper': {
        return Choices.Paper;
    }
    }
    return null;
};
