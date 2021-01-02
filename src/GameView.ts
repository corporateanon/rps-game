export interface GameView<Ctx> {
    showMessage(ctx: Ctx, message: string): Promise<void>;
}
