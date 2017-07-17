export default str =>
  str ? (str.startsWith('http://') ? str : `http://${str}`) : '';
