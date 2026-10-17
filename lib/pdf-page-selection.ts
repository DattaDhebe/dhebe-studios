export function parsePageSelection(input: string, totalPages: number): number[] {
  const trimmed = input.trim();

  if (!Number.isInteger(totalPages) || totalPages < 1) {
    throw new Error('The document has no selectable pages.');
  }

  if (!trimmed) {
    throw new Error('Enter at least one page number or range.');
  }

  const pages = new Set<number>();
  const segments = trimmed
    .split(',')
    .map((segment) => segment.trim());

  for (const segment of segments) {
    if (!/^\d+(?:\s*-\s*\d+)?$/.test(segment)) {
      throw new Error(`Invalid page selection: "${segment}".`);
    }
    if (segment.includes('-')) {
      const [rawStart, rawEnd] = segment.split('-').map((value) => value.trim());
      const start = Number.parseInt(rawStart, 10);
      const end = Number.parseInt(rawEnd, 10);

      if (!Number.isInteger(start) || !Number.isInteger(end)) {
        throw new Error(`Invalid range: "${segment}".`);
      }

      if (start < 1 || end < 1 || start > totalPages || end > totalPages || start > end) {
        throw new Error(`Range "${segment}" is outside 1-${totalPages}.`);
      }

      for (let page = start; page <= end; page += 1) {
        pages.add(page);
      }
      continue;
    }

    const page = Number.parseInt(segment, 10);
    if (!Number.isInteger(page) || page < 1 || page > totalPages) {
      throw new Error(`Page "${segment}" is outside 1-${totalPages}.`);
    }
    pages.add(page);
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export function formatPageSummary(pages: number[]): string {
  if (pages.length === 0) {
    return 'No pages selected';
  }

  return pages.join(', ');
}
