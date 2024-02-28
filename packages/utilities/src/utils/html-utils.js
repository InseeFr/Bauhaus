import React from 'react';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';
import { draftjsToMd } from './draftjs/draftjsToMd';
import { mdToDraftjs, REGEXPS } from './draftjs/mdToDraftjs';

export const containUnsupportedStyles = (attr = {}) => {
	return !!REGEXPS.map(r => r.regexp).find(
		regexp => !!Object.keys(attr).find(key => regexp.test(attr[key]))
	);
};
export const htmlToRawText = html => {
	const el = document.createElement('div');
	el.innerHTML = html || '';
	return el.textContent;
};

export const htmlLength = html => htmlToRawText(html).trim().length;
export const htmlIsEmpty = html => !(htmlLength(html) > 0);

/**
 * We cannot handle the markup exactly in ths same that it is in the remote
 * repository. So we format it the `ui` way and then we only operate on this
 * representation.
 */
export const rmesHtmlToRawHtml = html =>
	cleanHtml(stateToHTML(stateFromHTML(html)));

/**
 * We need to transform Draft Html to Xhtml
 */
export const draftHtmlToXhtml = html =>
	html
		.replace(/&nbsp;/g, ' ')
		.replace(/<br>/g, '<br/>')
		.replace(/<p><\/p>/g, '<br/>');

/**
 * We need to transform back the html to comply with the repository rules
 */
export const rawHtmlToRmesHtml = html =>
	`<div xmlns="http://www.w3.org/1999/xhtml">${draftHtmlToXhtml(html)}</div>`;

const rNewLine = /\n/g;
const rUselessSpace = /(>)\s*(<)/g;
export const cleanHtml = html => {
	const rawText = htmlToRawText(html);
	if (rawText === '') return '';
	return html.replace(rNewLine, '').replace(rUselessSpace, '$1$2');
};

export const delPTags = s => s && s.replace(/<p>/g, '').replace(/<\/p>/g, '');

//HACK avoid new lines and unecesseray whitespaces in the html. Not safe: some
//of these whitespaces might impact the rendered html. But for notes edited with
//the html editor, it should be ok.
export function htmlFromEditorState(editorState) {
	function setStyle(property, color) {
		return {
			element: 'span',
			style: {
				[property]: color,
			},
		};
	}
	let options = {
		inlineStyleFn: styles => {
			let key = 'color-';
			let color = styles.filter(value => value.startsWith(key)).first();
			if (color) {
				return setStyle('color', color.replace(key, ''));
			}

			key = 'bgcolor-';
			color = styles.filter(value => value.startsWith(key)).first();
			if (color) {
				return setStyle('backgroundColor', color.replace(key, ''));
			}
		},
	};

	const html = stateToHTML(editorState.getCurrentContent(), options);
	return cleanHtml(html);
}

export function editorStateFromHtml(html) {
	return EditorState.createWithContent(stateFromHTML(html));
}

export function mdFromEditorState(editorState) {
	/*
	* Sometimes the React editor  include space when formatting text (bold or italic).
	* With the following code, we remove this issue.
	* https://trello.com/c/t6jFYvMR/633-sims-rich-text
	*/
	const content = convertToRaw(editorState.getCurrentContent())

	for(let blockIndex = 0; blockIndex < content.blocks.length; blockIndex++){
		const text = content.blocks[blockIndex].text;
		const inlineStyleRanges = content.blocks[blockIndex].inlineStyleRanges;
		for(let inlineStyleIndex = 0; inlineStyleIndex < inlineStyleRanges.length; inlineStyleIndex++){
			const currentInlineStyle = inlineStyleRanges[inlineStyleIndex];
			const withSameOffset = inlineStyleRanges.filter((_, index) => {
				return index !== inlineStyleIndex && inlineStyleRanges[index].offset === currentInlineStyle.offset
			});
			let minLength = Math.min(currentInlineStyle.length, ...withSameOffset.map(style => style.length));
			if(text[currentInlineStyle.offset + minLength - 1] === " "){
				minLength -= 1;
			}
			currentInlineStyle.length = minLength;
			withSameOffset.forEach(style => {
				style.lengh = minLength;
			})
		}
	}
	const md =  draftjsToMd(content)
	return md
}

export function editorStateFromMd(md = '') {
	const mdToDraftJs = mdToDraftjs(md);
	const convertedFromRaw = convertFromRaw(mdToDraftJs)
	return EditorState.createWithContent(convertedFromRaw);
}

export function markdownToHtml(markdown) {
	return htmlFromEditorState(editorStateFromMd(markdown));
}

export function renderMarkdownElement(value) {
	return <div dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }} />;
}
