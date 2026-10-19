import { trackToolEvent } from './analytics';

export async function runToolOperation<T>(toolId: string, operation: () => T | Promise<T>): Promise<T> {
  trackToolEvent('start', toolId);
  try {
    const result = await operation();
    trackToolEvent('success', toolId);
    return result;
  } catch (error) {
    trackToolEvent('error', toolId, error instanceof DOMException && error.name === 'AbortError' ? 'cancelled' : 'processing_failed');
    throw error;
  }
}
