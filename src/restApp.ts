import { Application } from 'express';
import { Container } from 'inversify';
import IORedis, { Redis } from 'ioredis';
import 'reflect-metadata';
import { ComputerChoiceGenerator } from './ComputerChoiceGenerator';
import { DI } from './DI';
import { GameController } from './GameController';
import { ChoiceGenerator } from './interfaces/ChoiceGenerator';
import { GameContext } from './interfaces/GameContext';
import { GameView } from './interfaces/GameView';
import { Logger } from './interfaces/Logger';
import { RandomNumberGenerator } from './interfaces/RandomNumberGenerator';
import { ScoreStorage } from './interfaces/ScoreStorage';
import { LoggerImpl_Console } from './LoggerImpl_Console';
import { RandomNumberGeneratorImpl_Crypto } from './RandomNumberGeneratorImpl_Crypto';
import { createExpressAcpplication } from './rest/createExpressApplication';
import { GameContextREST } from './rest/GameContextREST';
import { GameViewImpl_REST } from './rest/GameViewImpl_REST';
import { ScoreStorageImpl_Memory } from './ScoreStorageImpl_Memory';
import { ScoreStorageImpl_Redis } from './ScoreStorageImpl_Redis';

const container = new Container();
container.bind<Logger>(DI.Logger).to(LoggerImpl_Console);
container
    .bind<RandomNumberGenerator>(DI.RandomNumberGenerator)
    .to(RandomNumberGeneratorImpl_Crypto);
container.bind<ChoiceGenerator>(DI.ChoiceGenerator).to(ComputerChoiceGenerator);
container.bind<GameController<GameContext>>(GameController).toSelf();
container.bind<GameView<GameContextREST>>(DI.GameView).to(GameViewImpl_REST);

if (process.env.REDIS) {
    container
        .bind<Redis>(DI.Redis)
        .toConstantValue(new IORedis(process.env.REDIS));
    container.bind<ScoreStorage>(DI.ScoreStorage).to(ScoreStorageImpl_Redis);
} else {
    container.bind<ScoreStorage>(DI.ScoreStorage).to(ScoreStorageImpl_Memory);
}

container
    .bind<Application>(DI.ExpressApplication)
    .toConstantValue(createExpressAcpplication());

(async function () {
    container.get<GameController<GameContext>>(GameController);
})().catch((e) => {
    console.error(e.stack ?? e);
    process.exit(1);
});
