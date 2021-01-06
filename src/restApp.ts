import { Container } from 'inversify';
import 'reflect-metadata';
import { ComputerChoiceGenerator } from './ComputerChoiceGenerator';
import { DI } from './DI';
import { GameController } from './GameController';
import { GameViewImpl_REST } from './rest/GameViewImpl_REST';
import { ChoiceGenerator } from './interfaces/ChoiceGenerator';
import { GameContext } from './interfaces/GameContext';
import { GameView } from './interfaces/GameView';
import { Logger } from './interfaces/Logger';
import { RandomNumberGenerator } from './interfaces/RandomNumberGenerator';
import { ScoreStorage } from './interfaces/ScoreStorage';
import { LoggerImpl_Console } from './LoggerImpl_Console';
import { RandomNumberGeneratorImpl_Crypto } from './RandomNumberGeneratorImpl_Crypto';
import { GameContextREST } from './rest/GameContextREST';
import { ScoreStorageImpl_Memory } from './ScoreStorageImpl_Memory';
import express, { Application } from 'express';
import session from 'express-session';

const container = new Container();
container.bind<Logger>(DI.Logger).to(LoggerImpl_Console);
container
    .bind<RandomNumberGenerator>(DI.RandomNumberGenerator)
    .to(RandomNumberGeneratorImpl_Crypto);
container.bind<ChoiceGenerator>(DI.ChoiceGenerator).to(ComputerChoiceGenerator);
container.bind<GameController<GameContext>>(GameController).toSelf();
container.bind<GameView<GameContextREST>>(DI.GameView).to(GameViewImpl_REST);
container.bind<ScoreStorage>(DI.ScoreStorage).to(ScoreStorageImpl_Memory);
container.bind<Application>(DI.ExpressApplication).toConstantValue(express());

(async function () {
    const app = container.get<Application>(DI.ExpressApplication);
    app.set('json spaces', 2);
    app.use(
        session({
            secret           : '9857698459745687',
            cookie           : { maxAge: 60000 },
            resave           : false,
            saveUninitialized: true,
        })
    );
    app.listen(process.env.PORT ?? 3000);

    container.get<GameController<GameContext>>(GameController);
})().catch((e) => {
    console.error(e.stack ?? e);
    process.exit(1);
});
