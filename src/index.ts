import { Container } from 'inversify';
import 'reflect-metadata';
import { DI } from './DI';
import { Draw } from './Draw';
import { RandomNumberGenerator } from './RandomNumberGenerator';
import { RandomNumberGeneratorImpl_Crypto } from './RandomNumberGeneratorImpl_Crypto';

const container = new Container();
container
    .bind<RandomNumberGenerator>(DI.RandomNumberGenerator)
    .to(RandomNumberGeneratorImpl_Crypto);
container.bind<Draw>(Draw).toSelf();

async function main() {
    const draw = container.get<Draw>(Draw);

    for (let i = 0; i < 50; i++) {
        const choice = await draw.getRandomChoice();
        console.log(choice);
    }
}

main().catch((e) => {
    console.error(e.stack ?? e);
    process.exit(1);
});
