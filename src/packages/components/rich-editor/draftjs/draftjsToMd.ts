const defaultMarkdownDict = {
	BOLD: '__',
	ITALIC: '*',
	STRIKETHROUGH: '+',
};

const RGB_REGEXP = /((bg)?color)-rgb\((.*)\)/;

const blockStyleDict = {
	'unordered-list-item': '- ',
	'header-one': '# ',
	'header-two': '## ',
	'header-three': '### ',
	'header-four': '#### ',
	'header-five': '##### ',
	'header-six': '###### ',
	blockquote: '> ',
};

const wrappingBlockStyleDict = {
	'code-block': '```',
};

const getBlockStyle = (currentStyle: string, appliedBlockStyles: string[]) => {
	if (currentStyle === 'ordered-list-item') {
		const counter = appliedBlockStyles.reduce((prev, style) => {
			if (style === 'ordered-list-item') {
				return prev + 1;
			}
			return prev;
		}, 1);
		return `${counter}. `;
	}

	//@ts-ignore
	return blockStyleDict[currentStyle] || '';
};

const applyWrappingBlockStyle = (currentStyle: string, content: string) => {
	if (currentStyle in wrappingBlockStyleDict) {
		//@ts-ignore
		const wrappingSymbol = wrappingBlockStyleDict[currentStyle];
		return `${wrappingSymbol}\n${content}\n${wrappingSymbol}`;
	}

	return content;
};

type Block = {
	type: 'atomic',
	text: string;
	entityRanges: { key: string}[]
}
type Entity = { type: string, data: { url: string, src: string, fileName: string}};
type EntityMap = Record<string, Entity>

const applyAtomicStyle = (block: Block, entityMap: EntityMap, content: string) => {
	if (block.type !== 'atomic') return content;
	// strip the test that was added in the media block
	const strippedContent = content.substring(
		0,
		content.length - block.text.length,
	);
	const key = block.entityRanges[0].key;
	const type = entityMap[key].type;
	const data = entityMap[key].data;
	if (type === 'draft-js-video-plugin-video') {
		return `${strippedContent}[[ embed url=${data.url || data.src} ]]`;
	}
	return `${strippedContent}![${data.fileName || ''}](${data.url || data.src})`;
};

const getEntityStart = (entity: Entity) => {
	if (entity.type === ' LINK') {
		return '[';
	}
	return '';
};

const getEntityEnd = (entity: Entity) => {
	if (entity.type === ' LINK') {
		return `](${entity.data.url})`;
	}
	return '';
};

function fixWhitespacesInsideStyle(text: string, style: any) {
	const { symbol } = style;

	// Text before style-opening marker (including the marker)
	const pre = text.slice(0, style.range.start);
	// Text between opening and closing markers
	const body = text.slice(style.range.start, style.range.end);
	// Trimmed text between markers
	const bodyTrimmed = body.trim();
	// Text after closing marker
	const post = text.slice(style.range.end);

	const bodyTrimmedStart = style.range.start + body.indexOf(bodyTrimmed);

	// Text between opening marker and trimmed content (leading spaces)
	const prefix = text.slice(style.range.start, bodyTrimmedStart);
	// Text between the end of trimmed content and closing marker (trailing spaces)
	const postfix = text.slice(
		bodyTrimmedStart + bodyTrimmed.length,
		style.range.end,
	);

	// Temporary text that contains trimmed content wrapped into original pre- and post-texts
	const newText = `${pre}${bodyTrimmed}${post}`;
	// Insert leading and trailing spaces between pre-/post- contents and their respective markers
	return newText.replace(
		`${symbol}${bodyTrimmed}${symbol}`,
		`${prefix}${symbol}${bodyTrimmed}${symbol}${postfix}`,
	);
}

function getInlineStyleRangesByLength(inlineStyleRanges: any) {
	return [...inlineStyleRanges].sort((a, b) => b.length - a.length);
}

export function draftjsToMd(raw: any, extraMarkdownDict?: any) {
	const markdownDict = { ...defaultMarkdownDict, ...extraMarkdownDict };
	const appliedBlockStyles: string[] = [];

	return raw.blocks
		.map((block: any) => {
			// totalOffset is a difference of index position between raw string and enhanced ones
			let totalOffset = 0;
			let returnString = '';

			// add block style
			returnString += getBlockStyle(block.type, appliedBlockStyles);
			appliedBlockStyles.push(block.type);

			const appliedStyles: any[] = [];
			returnString += block.text
				.split('')
				.reduce((text: any, currentChar: any, index: any) => {
					let newText = text;

					const sortedInlineStyleRanges = getInlineStyleRangesByLength(
						block.inlineStyleRanges,
					);

					// find all styled at this character
					sortedInlineStyleRanges
						.filter((range) => range.offset === index)
						.filter(
							(range) =>
								markdownDict[range.style] || RGB_REGEXP.test(range.style),
						)
						.forEach((currentStyle) => {
							let symbol;
							let symbolLength;
							if (RGB_REGEXP.test(currentStyle.style)) {
								symbol = `${currentStyle.style}`;
								symbolLength = symbol.length;
								newText += symbol;
								totalOffset += symbolLength;
							} else {
								symbolLength = markdownDict[currentStyle.style].length;
								newText += markdownDict[currentStyle.style];
								totalOffset += symbolLength;
								symbol = markdownDict[currentStyle.style];
							}

							appliedStyles.push({
								symbol,
								range: {
									start: currentStyle.offset + totalOffset,
									end: currentStyle.offset + currentStyle.length + totalOffset,
								},
								end: currentStyle.offset + (currentStyle.length - 1),
							});
						});

					// check for entityRanges starting and add if existing
					const entitiesStartAtChar = block.entityRanges.filter(
						(range: any) => range.offset === index,
					);
					entitiesStartAtChar.forEach((entity: any) => {
						newText += getEntityStart(raw.entityMap[entity.key]);
					});

					// add the current character to the md string
					newText += currentChar;

					// check for entityRanges ending and add if existing
					const entitiesEndAtChar = block.entityRanges.filter(
						(range: any) => range.offset + range.length - 1 === index,
					);
					entitiesEndAtChar.forEach((entity: any) => {
						newText += getEntityEnd(raw.entityMap[entity.key]);
					});

					// apply the 'ending' tags for any styles that end in the current position in order (stack)
					while (
						appliedStyles.length !== 0 &&
						appliedStyles[appliedStyles.length - 1].end === index
					) {
						const endingStyle = appliedStyles.pop();
						newText += endingStyle.symbol;

						newText = fixWhitespacesInsideStyle(newText, endingStyle);
						totalOffset += endingStyle.symbol.length;
					}

					return newText;
				}, '');

			returnString = applyWrappingBlockStyle(block.type, returnString);
			returnString = applyAtomicStyle(block, raw.entityMap, returnString);

			return returnString;
		})
		.join('\n');
}
