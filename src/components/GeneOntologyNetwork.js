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
					id: el.symbol,
					bg: '#808080'
				}
			});
			el.goAnnotation.forEach(e => {
				elements.push({
					group: 'nodes',
					data: {
						id: e.ontologyTerm.identifier,
						bg: '#F4D03F'
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
						label: 'data(id)',
						'background-color': 'data(bg)'
					}
				},
				{
					selector: 'edge',
					style: {
						'line-color': '#ccc'
					}
				}
			],
			layout: {
				name: 'cose-bilkent',
				quality: 'draft',
				fit: true,
				padding: 10,
				idealEdgeLength: 100
			}
		});
	}, [data]);
	return <div id="cy" style={{ height: 500 }}></div>;
}

export default GeneOntologyNetwork;
