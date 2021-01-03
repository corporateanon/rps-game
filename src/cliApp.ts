import { Container } from 'inversify';
import 'reflect-metadata';
import { GameController } from './GameController';
import { DI } from './DI';
import { Draw } from './Draw';
import { GameView } from './interfaces/GameView';
import { GameViewImpl_CLI } from './GameViewImpl_CLI';
import { RandomNumberGenerator } from './interfaces/RandomNumberGenerator';
import { RandomNumberGeneratorImpl_Crypto } from './RandomNumberGeneratorImpl_Crypto';
import { ScoreStorage } from './interfaces/ScoreStorage';
import { ScoreStorageImpl_Memory } from './ScoreStorageImpl_Memory';
import { LoggerImpl_Console } from './LoggerImpl_Console';
import { Logger } from './interfaces/Logger';
import { GameContext } from './interfaces/GameContext';

const container = new Container();
container.bind<Logger>(DI.Logger).to(LoggerImpl_Console);
container
    .bind<RandomNumberGenerator>(DI.RandomNumberGenerator)
    .to(RandomNumberGeneratorImpl_Crypto);
container.bind<Draw>(Draw).toSelf();
container.bind<GameController<GameContext>>(GameController).toSelf();
container.bind<GameView<GameContext>>(DI.GameView).to(GameViewImpl_CLI);
container.bind<ScoreStorage>(DI.ScoreStorage).to(ScoreStorageImpl_Memory);

async function main() {
    const ctrl = container.get<GameController<GameContext>>(GameController);
    ctrl.start({});
}

main().catch((e) => {
    console.error(e.stack ?? e);
    process.exit(1);
});
