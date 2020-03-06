import React, { useEffect } from 'react';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';

cytoscape.use(coseBilkent);

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
			],
			layout: {
				name: 'cose-bilkent',
				quality: 'default',
				nodeDimensionsIncludeLabels: false,
				fit: true,
				padding: 10,
				nodeRepulsion: 4500,
				idealEdgeLength: 100,
				nestingFactor: 0.1
			}
		});
	}, [data]);
	return <div id="cy" style={{ height: 500 }}></div>;
}

export default GeneOntologyNetwork;
