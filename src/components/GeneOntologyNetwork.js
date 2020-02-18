import React, { useEffect } from 'react';
import cytoscape from 'cytoscape';

function GeneOntologyNetwork({ data }) {
	useEffect(() => {
		const elements = [];
		data.forEach(el => {
			elements.push({
				group: 'nodes',
				data: {
					id: el.symbol
					// parent: 'nparent'
				}
			});
			el.goAnnotation.forEach(e => {
				elements.push({
					group: 'nodes',
					data: {
						id: e.ontologyTerm.identifier
					}
				});
				elements.push({
					group: 'edges',
					data: {
						target: el.symbol,
						source: e.ontologyTerm.identifier
					}
				});
			});
		});

		cytoscape({
			container: document.getElementById('cy'),
			elements: elements,
			grabbable: true,
			style: [
				{
					selector: 'node',
					style: {
						label: 'data(id)'
					}
				}
			]
		});
	}, [data]);
	return <div id="cy" style={{ height: 500 }}></div>;
}

export default GeneOntologyNetwork;
