import { injectable } from 'inversify';
import { GameView } from './GameView';

@injectable()
export class GameViewImpl_CLI implements GameView<null> {
    async showMessage(_ctx: null, message: string): Promise<void> {
        console.log(message);
    }
}
