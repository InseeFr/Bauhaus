export const htmlToRawText = html => {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el.innerText;
};

export const htmlLength = html => htmlToRawText(html).trim().length;
export const htmlIsEmpty = html => !(htmlLength(html) > 0);
