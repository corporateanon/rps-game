import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { APIClient, Choices, Score, ShowGameResultResponse } from './ApiClient';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    button: {
        margin  : 10,
        padding : '10px 20px',
        fontSize: 18,
    },

    table: {
        borderCollapse: 'collapse',
        '& td, & th'  : {
            border : '1px solid #777',
            padding: 10,
        },
        '& th': {
            backgroundColor: '#eee',
        },
    },
});

const api = new APIClient(axios.create());

export const App: FC = () => {
    const classes = useStyles();

    const [gameStarted, setGameStarted] = useState(false);
    const [gameResult, setGameResult] = useState<ShowGameResultResponse | null>(
        null
    );
    const [score, setScore] = useState<Score | null>(null);

    const handlePlayClick = useCallback(async () => {
        await api.startGame();
        setGameStarted(true);
        setGameResult(null);
    }, []);

    const makeChoice = async (choice: Choices) => {
        const res = await api.makeChoice(choice);
        setGameResult(res);
        setScore(res.scoreBoard);
        setGameStarted(false);
    };

    const handleRockClick = useCallback(() => {
        makeChoice(Choices.Rock);
    }, []);
    const handleScissorsClick = useCallback(() => {
        makeChoice(Choices.Scissors);
    }, []);
    const handlePaperClick = useCallback(() => {
        makeChoice(Choices.Paper);
    }, []);

    return (
        <>
            {gameResult && (
                <div>
                    <h2>{gameResult.result}</h2>
                    <p>{gameResult.message}</p>
                </div>
            )}
            <div>
                {gameStarted ? (
                    <>
                        <button
                            className={classes.button}
                            onClick={handleRockClick}
                        >
                            Rock
                        </button>
                        <button
                            className={classes.button}
                            onClick={handlePaperClick}
                        >
                            Paper
                        </button>
                        <button
                            className={classes.button}
                            onClick={handleScissorsClick}
                        >
                            Scissors
                        </button>
                    </>
                ) : (
                    <button
                        className={classes.button}
                        onClick={handlePlayClick}
                    >
                        {gameResult ? 'Play again' : 'Play'}
                    </button>
                )}
            </div>
            {score && (
                <div>
                    <h4>Score Board</h4>

                    <table className={classes.table}>
                        <tbody>
                            <tr>
                                <th>Computer</th>
                                <td>{score.computerWinsCount}</td>
                            </tr>
                            <tr>
                                <th>Human</th>
                                <td>{score.humanWinsCount}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};
