export function generateShortUrl(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortUrl = '';
  // Generate a random 6-character string with upper and lower case letters and numbers.
  for (let i = 0; i < 6; i += 1) {
    shortUrl += characters[Math.floor(Math.random() * characters.length)];
  }
  return shortUrl;
}
export function convertToHyphenated(str: string): string {
  return str.split(' ').join('-');
}
