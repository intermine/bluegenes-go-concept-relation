const query = geneId => ({
	constraintLogic: 'B and C and E and A',
	from: 'Gene',
	select: [
		'id',
		'symbol',
		'secondaryIdentifier',
		'primaryIdentifier',
		'organism.shortName',
		'organism.taxonId',
		'goAnnotation.evidence.code.code',
		'goAnnotation.ontologyTerm.identifier',
		'goAnnotation.ontologyTerm.name',
		'goAnnotation.ontologyTerm.namespace'
	],
	orderBy: [
		{
			path: 'symbol',
			direction: 'ASC'
		}
	],
	joins: ['goAnnotation'],
	where: [
		{
			path: 'goAnnotation.qualifier',
			op: 'IS NULL',
			value: 'IS NULL',
			code: 'B'
		},
		{
			path: 'goAnnotation.ontologyTerm.obsolete',
			op: '=',
			value: 'false',
			code: 'C'
		},
		{
			path: 'Gene',
			op: 'LOOKUP',
			value: geneId,
			extraValue: 'H. sapiens',
			code: 'A'
		},
		{
			path: 'goAnnotation.evidence.code.code',
			op: 'ONE OF',
			values: ['EXP', 'IDA', 'IPI', 'IMP', 'IGI', 'IEP', 'TAS', 'IC'],
			code: 'E'
		}
	]
});

const queryData = ({ geneId, serviceUrl, imjsClient = imjs }) => {
	const service = new imjsClient.Service({
		root: serviceUrl
	});
	return new Promise((resolve, reject) => {
		service
			.records(query(geneId))
			.then(res => {
				// if (res.length === 0) reject('No data found!');
				resolve(res);
			})
			.catch(() => reject('No data found!'));
	});
};

export { queryData };
