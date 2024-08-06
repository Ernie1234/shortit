export function generateShortUrl(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}
export function convertToHyphenated(str: string): string {
  return str.split(' ').join('-');
}
