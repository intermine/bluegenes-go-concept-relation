import React, { useEffect } from 'react';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';

cytoscape.use(coseBilkent);

function createTooltip(position, content) {
	const div = document.createElement('div');
	const rootElem = document.getElementsByClassName('rootContainer')[0];
	if (rootElem.offsetWidth - position.x > 300) position.x += 50;
	else position.x -= 350;
	div.style.background = 'gray';
	div.style.position = 'absolute';
	div.style.color = 'white';
	div.innerHTML = content;
	div.style.top = position.y + 'px';
	div.style.fontFamily = 'arial';
	div.style.left = position.x + 'px';
	div.style.padding = '10px';
	div.style.width = '310px';
	div.style.border = '1px solid black';
	div.style.borderRadius = '8px';
	document.body.append(div);
	return div;
}

function GeneOntologyNetwork({ data }) {
	useEffect(() => {
		const elements = [];
		data.forEach(el => {
			const { symbol, secondaryIdentifier, primaryIdentifier, organism } = el;
			elements.push({
				group: 'nodes',
				data: {
					id: el.symbol,
					bg: '#808080',
					info: {
						class: el.class,
						symbol,
						shortName: organism.shortName,
						primaryIdentifier,
						secondaryIdentifier
					}
				}
			});
			el.goAnnotation.forEach(e => {
				const { description, name, namespace } = e.ontologyTerm;
				elements.push({
					group: 'nodes',
					data: {
						id: e.ontologyTerm.identifier,
						bg: '#F4D03F',
						info: {
							class: e.class,
							name,
							namespace,
							description
						}
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

		let cy = cytoscape({
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
		let div;
		let node = cy.elements().nodes();
		node.unbind('mouseover');
		node.bind('mouseover', event => {
			const {
				data: { info }
			} = event.target[0]._private;
			let content;
			document.body.style.cursor = 'pointer';
			if (info.class === 'Gene') {
				event.target.style('backgroundColor', '#666666');
				content = `
					<div>
						<span>Symbol: </span><strong>${info.symbol}</strong><br/><div style="padding: 2px"></div>
						<span>Name: </span><strong>${info.shortName}</strong><br/><div style="padding: 2px"></div>
						<span>Primary Identifier: </span><strong>${info.primaryIdentifier}</strong><br/><div style="padding: 2px"></div>
						<span>Secondary Identifier: </span><strong>${info.secondaryIdentifier}</strong>
					</div>
				`;
			}
			if (info.class === 'GOAnnotation') {
				event.target.style('backgroundColor', '#EDBE05');
				content = `
					<div>
						<span>Symbol: </span><strong>${event.target[0]._private.data.id}</strong><br/><div style="padding: 4px"></div>
						<span>Name: </span><strong>${info.name}</strong><br/><div style="padding: 4px"></div>
						<span>NameSpace: </span><strong>${info.namespace}</strong><br/><div style="padding: 4px"></div>
						<span>Description: </span><strong>${info.description}</strong>
					</div>
				`;
			}

			div = createTooltip(event.renderedPosition, content);
		});

		node.unbind('mouseout');
		node.bind('mouseout', event => {
			document.body.style.cursor = 'default';
			const {
				data: { info }
			} = event.target[0]._private;
			div.style.display = 'none';
			if (info.class === 'Gene')
				event.target.style('backgroundColor', '#808080');
			if (info.class === 'GOAnnotation')
				event.target.style('backgroundColor', '#F4D03F');
		});
	}, [data]);
	return <div id="cy" style={{ height: 500, position: 'relative' }}></div>;
}

export default GeneOntologyNetwork;
