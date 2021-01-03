export function assertDefined<T>(
    v: T | undefined,
    message = 'Assertion failed'
): asserts v is T {
    if (v === undefined) {
        throw new Error(message);
    }
}
