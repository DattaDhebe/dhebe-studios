export function textStatistics(text: string) {
  const words = typeof Intl.Segmenter === 'function'
    ? Array.from(new Intl.Segmenter('en', { granularity: 'word' }).segment(text)).filter(item => item.isWordLike).length
    : (text.match(/[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*/gu) || []).length;
  const characters = typeof Intl.Segmenter === 'function'
    ? Array.from(new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(text)).length
    : Array.from(text).length;
  return {
    words, characters,
    charactersWithoutSpaces: Array.from(text.replace(/\s/gu, '')).length,
    paragraphs: text.trim() ? text.trim().split(/\n\s*\n/).length : 0,
    readingSeconds: Math.ceil(words / 225 * 60),
    speakingSeconds: Math.ceil(words / 150 * 60),
  };
}
