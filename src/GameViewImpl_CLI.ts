import { injectable } from 'inversify';
import { GameView } from './GameView';
import chalk from 'chalk';

@injectable()
export class GameViewImpl_CLI implements GameView<null> {
    async showHash(_ctx: null, hash: string): Promise<void> {
        console.log(
            chalk`I made my move.\nBut i won't tell it to you until you tell me yours.\nTo prove that I am not lying, use the following hash:\n {bold ${hash}}`
        );
    }
    async showMessage(_ctx: null, message: string): Promise<void> {
        console.log(message);
    }
}
