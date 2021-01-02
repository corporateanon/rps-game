import { inject, injectable } from 'inversify';
import { DI } from './DI';
import { GameView } from './GameView';

@injectable()
export class GameController<Ctx> {
    constructor(@inject(DI.GameView) private view: GameView<Ctx>) {}

    public start(ctx: Ctx): void {
        this.view.showMessage(ctx, 'hello');
    }
}
