import imjs from 'imjs';
import { queryData } from './src/query';

describe('query', () => {
	const mockData = {
		entity: [1215734, 1161508, 1020855, 1205381],
		service: 'https://www.humanmine.org/humanmine'
	};

	test('should return a promise resolving with correct data', () => {
		const promise = queryData({
			geneId: mockData.entity,
			serviceUrl: mockData.service,
			imjsClient: imjs
		}).catch(() => {});

		expect(promise).resolves.toBeInstanceOf(Array);
		return promise.then(res => {
			expect(res.length).toBeGreaterThanOrEqual(1);
			expect(res[0].goAnnotation.length).toBeGreaterThanOrEqual(0);
		});
	});

	test('should return a rejected promise when data not available', () => {
		const promise = queryData({
			geneId: '128',
			serviceUrl: mockData.service,
			imjsClient: imjs
		});
		return promise.catch(res => expect(res).toBe('No data found!'));
	});
});
