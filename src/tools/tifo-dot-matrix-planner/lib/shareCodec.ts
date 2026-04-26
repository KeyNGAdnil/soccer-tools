import type { CornerKey, SharePayloadV1 } from './types';

const utf8ToBase64Url = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const base64UrlToUtf8 = (b64url: string): string => {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  const binary = atob(b64 + pad);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

/**
 * 分享数据（v2）：紧凑数组，避免 JSON 长字段名。
 * [2, 左上x,y, 右上x,y, 左下x,y, 右下x,y, 字距, 文案]
 * 旧版 v1 对象仍支持解码。
 */
export const encodeSharePayload = (payload: SharePayloadV1): string => {
  const c = payload.corners;
  const tuple: [
    2,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    string,
  ] = [
    2,
    c.topLeft.x,
    c.topLeft.y,
    c.topRight.x,
    c.topRight.y,
    c.bottomLeft.x,
    c.bottomLeft.y,
    c.bottomRight.x,
    c.bottomRight.y,
    payload.letterSpacing,
    payload.slogan.trim(),
  ];
  return utf8ToBase64Url(JSON.stringify(tuple));
};

export const decodeSharePayload = (raw: string): SharePayloadV1 | null => {
  try {
    const text = base64UrlToUtf8(raw);
    const data = JSON.parse(text) as unknown;

    if (Array.isArray(data) && data[0] === 2 && data.length === 11) {
      const [, tlx, tly, trx, trY, blx, bly, brx, brY, spRaw, sloganRaw] = data;
      const nums = [tlx, tly, trx, trY, blx, bly, brx, brY, spRaw];
      if (
        !nums.every((n) => typeof n === 'number' && Number.isFinite(n)) ||
        typeof sloganRaw !== 'string' ||
        !sloganRaw.trim()
      ) {
        return null;
      }
      return {
        v: 1,
        corners: {
          topLeft: { x: tlx as number, y: tly as number },
          topRight: { x: trx as number, y: trY as number },
          bottomLeft: { x: blx as number, y: bly as number },
          bottomRight: { x: brx as number, y: brY as number },
        },
        slogan: (sloganRaw as string).trim(),
        letterSpacing: Math.max(0, Math.min(200, spRaw as number)),
      };
    }

    const legacy = data as SharePayloadV1;
    if (
      legacy?.v !== 1 ||
      !legacy.corners ||
      typeof legacy.slogan !== 'string' ||
      !legacy.slogan.trim()
    ) {
      return null;
    }
    const ck: CornerKey[] = [
      'topLeft',
      'topRight',
      'bottomLeft',
      'bottomRight',
    ];
    for (const k of ck) {
      const p = legacy.corners[k];
      if (!p || typeof p.x !== 'number' || typeof p.y !== 'number') return null;
    }
    const sp = Number(legacy.letterSpacing);
    if (!Number.isFinite(sp)) return null;
    return {
      v: 1,
      corners: legacy.corners,
      slogan: legacy.slogan,
      letterSpacing: Math.max(0, Math.min(200, sp)),
    };
  } catch {
    return null;
  }
};

export const readShareFromSearch = (): SharePayloadV1 | null => {
  if (typeof window === 'undefined') return null;
  const raw = new URLSearchParams(window.location.search).get('share');
  if (!raw) return null;
  return decodeSharePayload(raw);
};
