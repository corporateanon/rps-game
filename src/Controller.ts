import { inject, injectable } from 'inversify';
import { DI } from './DI';
import { Draw } from './Draw';
import { GameView } from './GameView';

@injectable()
export class GameController<Ctx> {
    constructor(
        @inject(DI.GameView) private view: GameView<Ctx>,
        @inject(Draw) private draw: Draw
    ) {}

    public async start(ctx: Ctx): Promise<void> {
        // this.view.showMessage(ctx, 'hello');
        const provenChoice = await this.draw.getRandomChoice();
        await this.view.showHash(ctx, provenChoice.hash);
    }
}
