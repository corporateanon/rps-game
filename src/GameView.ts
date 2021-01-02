export interface GameView<Ctx> {
    showMessage(ctx: Ctx, message: string): Promise<void>;
    showHash(ctx: Ctx, hash: string): Promise<void>;
}
