export default html => {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el.innerText.trim().length;
};
