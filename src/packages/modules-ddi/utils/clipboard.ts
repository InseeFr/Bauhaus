/**
 * Plafond observé du presse-papiers des navigateurs Chromium sous Wayland (Vivaldi, 2026-10) : au-delà
 * de 4 Mio, `navigator.clipboard.writeText` ne transmet que le début du texte, sans erreur. Firefox
 * et le système transportent bien plus ; seuls ces navigateurs coupent.
 */
const CLIPBOARD_SAFE_SIZE = 4 * 1024 * 1024;

/** Vrai si la copie de `text` risque d'être tronquée par certains navigateurs. */
export const exceedsClipboardSafeSize = (text: string) =>
  new Blob([text]).size > CLIPBOARD_SAFE_SIZE;
