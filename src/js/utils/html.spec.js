import { rmesHtmlToRawHtml } from './html';

describe('build raw html from rmes version of html', () => {
  it('removes wrapping `div` and namespace references', () => {
    const html = `<div xmlns="http://www.w3.org/1999/xhtml"><p xmlns="http://www.w3.org/1999/xhtml">Un propriétaire accédant est un propriétaire qui a encore des emprunts à rembourser pour l’achat de sa résidence principale. </p></div>`;
    expect(rmesHtmlToRawHtml(html)).toEqual(
      '<p>Un propriétaire accédant est un propriétaire qui a encore des emprunts à rembourser pour l’achat de sa résidence principale.</p>'
    );
  });
});
