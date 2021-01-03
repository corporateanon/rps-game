import { Container } from 'inversify';
import 'reflect-metadata';
import { GameController } from './GameController';
import { DI } from './DI';
import { Draw } from './Draw';
import { GameView } from './GameView';
import { GameViewImpl_CLI } from './GameViewImpl_CLI';
import { RandomNumberGenerator } from './RandomNumberGenerator';
import { RandomNumberGeneratorImpl_Crypto } from './RandomNumberGeneratorImpl_Crypto';
import { ScoreStorage } from './ScoreStorage';
import { ScoreStorageImpl_Memory } from './ScoreStorageImpl_Memory';

const container = new Container();
container
    .bind<RandomNumberGenerator>(DI.RandomNumberGenerator)
    .to(RandomNumberGeneratorImpl_Crypto);
container.bind<Draw>(Draw).toSelf();
container.bind<GameController<null>>(GameController).toSelf();
container.bind<GameView<null>>(DI.GameView).to(GameViewImpl_CLI);
container.bind<ScoreStorage>(DI.ScoreStorage).to(ScoreStorageImpl_Memory);

async function main() {
    // const draw = container.get<Draw>(Draw);

    // for (let i = 0; i < 50; i++) {
    //     const choice = await draw.getRandomChoice();
    //     console.log(choice);
    // }

    const ctrl = container.get<GameController<null>>(GameController);

    ctrl.start(null);
}

main().catch((e) => {
    console.error(e.stack ?? e);
    process.exit(1);
});
