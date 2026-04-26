/**
 * Clipboard API 仅在「安全上下文」可用（HTTPS、localhost）。
 * 通过 http://公网IP 访问时会失败，故用隐藏 textarea + execCommand 作回退。
 */
export async function copyTextToClipboard(text: string): Promise<void> {
  if (
    typeof window !== 'undefined' &&
    window.isSecureContext &&
    navigator.clipboard?.writeText
  ) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  ta.style.top = '0';
  document.body.appendChild(ta);
  ta.select();
  ta.setSelectionRange(0, text.length);
  try {
    const ok = document.execCommand('copy');
    if (!ok) throw new Error('execCommand copy returned false');
  } finally {
    document.body.removeChild(ta);
  }
}
