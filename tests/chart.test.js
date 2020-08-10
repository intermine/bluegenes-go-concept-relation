import React from 'react';
import ReactDOM from 'react-dom';
import imjs from 'imjs';
import { queryData } from '../src/query';
import GeneOntologyNetwork from '../src/components/GeneOntologyNetwork';

describe('charts', () => {
	let data = [];
	beforeAll(() => {
		return queryData({
			geneId: [1215734, 1161508],
			serviceUrl: 'https://www.humanmine.org/humanmine',
			imjsClient: imjs
		})
			.then(res => (data = res))
			.catch(() => {});
	});

	test('GeneOntologyNetwork renders canvas', () => {
		const el = document.createElement('div');
		ReactDOM.render(<GeneOntologyNetwork data={data} />, el);
		expect(el.innerHTML).toContain('div');
	});
});
