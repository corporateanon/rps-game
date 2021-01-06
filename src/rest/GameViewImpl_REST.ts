import { Application } from 'express';
import { inject, injectable } from 'inversify';
import qs from 'querystring';
import { DI } from '../DI';
import { ActionHandler } from '../interfaces/GameAction';
import { GameView } from '../interfaces/GameView';
import { choiceStrToChoice } from '../models/Choices';
import { GameContextREST } from './GameContextREST';

type GameSessionData = Pick<
    GameContextREST,
    'gameResult' | 'provenChoice' | 'score'
> & { started?: boolean };

function serializeContextIntoSession(ctx: GameContextREST) {
    const sess = ctx.req.session as GameSessionData;
    sess.gameResult = ctx.gameResult;
    sess.provenChoice = ctx.provenChoice;
    sess.score = ctx.score;
}
function unserializeContextFromSession(ctx: GameContextREST) {
    const sess = ctx.req.session as GameSessionData;
    ctx.gameResult = sess.gameResult;
    ctx.provenChoice = sess.provenChoice;
    ctx.score = sess.score;
}
function clearSession(ctx: GameContextREST) {
    const sess = ctx.req.session as GameSessionData;
    sess.score = undefined;
    sess.started = undefined;
    sess.gameResult = undefined;
    sess.provenChoice = undefined;
}

@injectable()
export class GameViewImpl_REST implements GameView<GameContextREST> {
    private dispatch?: ActionHandler<GameContextREST>;

    constructor(
        @inject(DI.ExpressApplication)
        private app: Application
    ) {
        this.app.post('/start', (req, res) => {
            const ctx = { req, res };
            unserializeContextFromSession(ctx);
            this.dispatch?.(ctx, { type: 'GameActionStart' });
        });

        this.app.post('/choice/:choice', (req, res) => {
            const ctx = { req, res };
            unserializeContextFromSession(ctx);
            const { started } = ctx.req.session as GameSessionData;
            if (!started) {
                res.status(400).json({
                    error  : 'The game has not started',
                    comment: 'To start a new game: POST /start',
                });
                return;
            }

            const choice = choiceStrToChoice(req.params.choice);
            if (choice === null) {
                res.status(400).json({ error: 'Invalid choice' });
                return;
            }

            this.dispatch?.(ctx, {
                type   : 'GameActionChoice',
                payload: { choice },
            });
        });
    }

    subscribe(handler: ActionHandler<GameContextREST>): void {
        this.dispatch = handler;
    }

    async askForChoice(ctx: GameContextREST): Promise<void> {
        serializeContextIntoSession(ctx);
        (ctx.req.session as GameSessionData).started = true;
        ctx.res.json({
            message           : 'Make your choice',
            comment           : 'To make a choice: POST /choice/{scissors|rock|paper}',
            computerChoiceHash: ctx.provenChoice?.hash,
        });
    }

    async showGameResult(ctx: GameContextREST): Promise<void> {
        serializeContextIntoSession(ctx);
        const { message, type } = ctx.gameResult ?? {};

        const resultMessage =
            type === 'iWon'
                ? 'Computer wins'
                : type === 'theyWon'
                    ? 'You win'
                    : type === 'tie'
                        ? 'The game is tied'
                        : '';

        const proofLink = `https://api.hashify.net/hash/md5/hex?${qs.stringify({
            value: ctx.provenChoice?.proof,
        })}`;

        clearSession(ctx);

        ctx.res.json({
            result    : resultMessage,
            message,
            comment   : 'To start a new game: POST /start',
            proof     : ctx.provenChoice?.proof,
            proofLink,
            scoreBoard: ctx.score,
        });
    }
}
