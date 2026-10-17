export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Unexpected file reader output.'));
    };

    reader.onerror = () => {
      reject(new Error('Unable to read the selected file.'));
    };

    reader.readAsDataURL(file);
  });
}

export function parseBase64Input(input: string): {
  mimeType: string | null;
  payload: string;
} {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error('Add a Base64 value before converting.');
  }

  const dataUrlMatch = trimmed.match(/^data:([^,]*?);base64,(.+)$/is);

  if (dataUrlMatch) {
    const mimeType = dataUrlMatch[1]?.split(';')[0]?.trim() || null;

    return {
      mimeType,
      payload: normalizeBase64Payload(dataUrlMatch[2] ?? ''),
    };
  }

  return {
    mimeType: null,
    payload: normalizeBase64Payload(trimmed),
  };
}

export function base64ToBytes(input: string): Uint8Array {
  const { payload } = parseBase64Input(input);
  const binary = atob(payload);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

export function base64ToText(input: string): string {
  return new TextDecoder().decode(base64ToBytes(input));
}

export function base64ToAscii(input: string): string {
  const bytes = base64ToBytes(input);

  for (const byte of bytes) {
    if (byte > 0x7f) {
      throw new Error('This payload contains non-ASCII bytes. Try Base64 to Text instead.');
    }
  }

  return new TextDecoder('utf-8').decode(bytes);
}

export function base64ToHex(input: string): string {
  return Array.from(base64ToBytes(input))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function bytesToBlobUrl(bytes: Uint8Array, mimeType = 'application/octet-stream'): string {
  const arrayBuffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(arrayBuffer).set(bytes);

  return URL.createObjectURL(new Blob([arrayBuffer], { type: mimeType }));
}

function normalizeBase64Payload(input: string): string {
  const sanitized = input.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');

  if (!sanitized) {
    throw new Error('Add a Base64 value before converting.');
  }

  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(sanitized)) {
    throw new Error('The input contains characters that are not valid Base64.');
  }

  if (sanitized.length % 4 === 1) {
    throw new Error('The Base64 input appears to be incomplete.');
  }

  if (sanitized.includes('=') && sanitized.length % 4 !== 0) {
    throw new Error('The Base64 padding is invalid.');
  }

  return sanitized.padEnd(sanitized.length + ((4 - (sanitized.length % 4 || 4)) % 4), '=');
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

export function textToBase64(input: string): string {
  return bytesToBase64(new TextEncoder().encode(input));
}

export function hexToBase64(input: string): string {
  const normalized = input.replace(/^0x/i, '').replace(/\s+/g, '').toLowerCase();

  if (!normalized) {
    return '';
  }

  if (!/^[\da-f]+$/.test(normalized)) {
    throw new Error('Hex input can only contain characters 0-9 and A-F.');
  }

  if (normalized.length % 2 !== 0) {
    throw new Error('Hex input must contain an even number of characters.');
  }

  const bytes = new Uint8Array(normalized.length / 2);

  for (let index = 0; index < normalized.length; index += 2) {
    bytes[index / 2] = Number.parseInt(normalized.slice(index, index + 2), 16);
  }

  return bytesToBase64(bytes);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;

  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

export function formatTextSize(characters: number): string {
  if (characters === 0) {
    return '0 chars';
  }

  if (characters < 1024) {
    return `${characters} chars`;
  }

  return `${(characters / 1024).toFixed(1)} KB text`;
}
