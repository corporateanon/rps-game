import { Container } from 'inversify';
import 'reflect-metadata';
import { GameController } from './GameController';
import { DI } from './DI';
import { ComputerChoiceGenerator } from './ComputerChoiceGenerator';
import { GameView } from './interfaces/GameView';
import { GameViewImpl_CLI } from './GameViewImpl_CLI';
import { RandomNumberGenerator } from './interfaces/RandomNumberGenerator';
import { RandomNumberGeneratorImpl_Crypto } from './RandomNumberGeneratorImpl_Crypto';
import { ScoreStorage } from './interfaces/ScoreStorage';
import { ScoreStorageImpl_Memory } from './ScoreStorageImpl_Memory';
import { LoggerImpl_Console } from './LoggerImpl_Console';
import { Logger } from './interfaces/Logger';
import { GameContext } from './interfaces/GameContext';
import { ChoiceGenerator } from './interfaces/ChoiceGenerator';
import IORedis, { Redis } from 'ioredis';
import { ScoreStorageImpl_Redis } from './ScoreStorageImpl_Redis';

// 1. First we build the DI-container which holds the chosen implemntations of the application parts

const container = new Container();
container.bind<Logger>(DI.Logger).to(LoggerImpl_Console);
container
    .bind<RandomNumberGenerator>(DI.RandomNumberGenerator)
    .to(RandomNumberGeneratorImpl_Crypto);
container.bind<ChoiceGenerator>(DI.ChoiceGenerator).to(ComputerChoiceGenerator);
container.bind<GameController<GameContext>>(GameController).toSelf();
container.bind<GameView<GameContext>>(DI.GameView).to(GameViewImpl_CLI);
if (process.env.REDIS) {
    container
        .bind<Redis>(DI.Redis)
        .toConstantValue(new IORedis(process.env.REDIS));
    container.bind<ScoreStorage>(DI.ScoreStorage).to(ScoreStorageImpl_Redis);
} else {
    container.bind<ScoreStorage>(DI.ScoreStorage).to(ScoreStorageImpl_Memory);
}

// 2. Then we start the application by dispatching GameActionStart action to the controller

(async function () {
    const ctrl = container.get<GameController<GameContext>>(GameController);
    ctrl.dispatchAction({}, { type: 'GameActionStart' });
})().catch((e) => {
    console.error(e.stack ?? e);
    process.exit(1);
});
