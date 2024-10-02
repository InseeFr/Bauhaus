import { buildApi, computeDscr, guessMethod, buildCall } from './build-api';
import { vi } from 'vitest';
describe('guess method from end point', () => {
	it('should return GET', () => {
		expect(guessMethod('getSomething')).toEqual('GET');
	});
	it('...or PUT', () => {
		expect(guessMethod('putSomething')).toEqual('PUT');
	});
	it('...or POST', () => {
		expect(guessMethod('postSomething')).toEqual('POST');
	});
	it('...and throw otherwise', () => {
		expect(() => guessMethod('invalidSomething')).toThrow();
	});
});

const handler = (res: Response) => res.text().then((id) => id);
const postCommentFn = (username: string, info: unknown) => [
	`comment/${username}`,
	{
		method: 'POST',
		body: info,
	},
	handler,
];

describe('compute api call description', () => {
	it('should fetch an url with some options and chain the given then handler', () => {
		global.fetch = vi.fn();
		const [url, options, thenHandler] = computeDscr(postCommentFn, [
			'john',
			'some raw text',
		]);
		expect(url).toEqual('comment/john');
		expect(options).toMatchObject({ method: 'POST', body: 'some raw text' });
		expect(thenHandler).toEqual(handler);
	});
});

describe('build call', () => {
	it('returns a function which calls fetch with the computed body and chains it with the given handler', () => {
		const resPromise = () => Promise.resolve(42);
		const fetch = vi.fn(() =>
			Promise.resolve({
				ok: true,
				text: resPromise,
			}),
		);
		window.fetch = fetch as any;
		const remoteCall = buildCall('context', 'postComment', postCommentFn);
		expect.assertions(1);
		return expect(remoteCall('john', 'some text')).resolves.toEqual(42);
	});
});

describe('build api', () => {
	it('takes an object and returns an object with the same properties', () => {
		expect(
			buildApi('http://localhost:8080', { getSomething: vi.fn() }),
		).toHaveProperty('getSomething');
	});
	buildApi('http://localhost:8080', { getSomething: () => ['people'] });
});
