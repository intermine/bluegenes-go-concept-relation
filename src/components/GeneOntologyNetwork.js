import React, { useEffect } from 'react';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
import popper from 'cytoscape-popper';
import tippy from 'tippy.js';

cytoscape.use(popper);
cytoscape.use(coseBilkent);

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

		let cy = (window.cy = cytoscape({
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
		}));
		let node = cy.elements().nodes();
		cy.ready(() => {
			node.forEach(ele => {
				makePopper(ele);
			});
		});
		node.unbind('mouseover');
		node.bind('mouseover', event => event.target.tippy.show());

		node.unbind('mouseout');
		node.bind('mouseout', event => event.target.tippy.hide());
	}, [data]);

	function makePopper(ele) {
		ele.tippy = tippy(document.createElement('div'), {
			trigger: 'manual',
			onCreate(instance) {
				instance.setProps({
					getReferenceClientRect: () => ({
						width: 0,
						height: 0,
						top: event.clientY,
						bottom: event.clientY,
						left: event.clientX,
						right: event.clientX
					})
				});
			},
			content: () => {
				let content = document.createElement('div');
				let { info } = ele.data();
				if (info.class === 'Gene') {
					content.innerHTML = `
						<strong>Symbol: </strong>${info.symbol}<br/>
						<strong>Name: </strong>${info.shortName}<br/>
						<strong>Primary Identifier: </strong>${info.primaryIdentifier}<br/>
						<strong>Secondary Identifier: </strong>${info.secondaryIdentifier}
					`;
				}
				if (info.class === 'GOAnnotation') {
					content.innerHTML = `
						<strong>Name: </strong>${info.name}<br/>
						<strong>NameSpace: </strong>${info.namespace}<br/>
						<strong>Description: </strong>${info.description}
					`;
				}
				return content;
			}
		});
	}
	return <div id="cy" style={{ height: 500 }}></div>;
}

export default GeneOntologyNetwork;
