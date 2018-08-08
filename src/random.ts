const CHARS = '0123456789abcdefghijklmnopqrstuvwxyz'

export function createRandom(length: number = 8, chars: string = CHARS): string {
    let id = '';
    for (let i = 0; i < length; i++) {
        const charIndex = Math.floor(Math.random() * chars.length)
        id += chars.charAt(charIndex);
    }
    return id;
}
