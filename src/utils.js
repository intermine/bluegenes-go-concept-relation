const geneColor = '#808080';
const hoveredGeneColor = '#666666';
const goTermColor = '#F4D03F';
const hoveredGoTermColor = '#EDBE05';

function getGraphData(data) {
	const elements = [];
	data.forEach(el => {
		const { symbol, secondaryIdentifier, primaryIdentifier, organism } = el;
		elements.push({
			group: 'nodes',
			data: {
				id: el.symbol,
				bg: geneColor,
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
					bg: goTermColor,
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
	return elements;
}

function createCytoscapeConfig(elements) {
	return {
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
	};
}

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

function createTooltipData(node) {
	const {
		data: { info }
	} = node.target[0]._private;

	if (info.class === 'Gene') {
		node.target.style('backgroundColor', hoveredGeneColor);
		return `
			<div>
				<span>Symbol: </span><strong>${info.symbol}</strong><br/><div style="padding: 2px"></div>
				<span>Name: </span><strong>${info.shortName}</strong><br/><div style="padding: 2px"></div>
				<span>Primary Identifier: </span><strong>${info.primaryIdentifier}</strong><br/><div style="padding: 2px"></div>
				<span>Secondary Identifier: </span><strong>${info.secondaryIdentifier}</strong>
			</div>
		`;
	}
	if (info.class === 'GOAnnotation') {
		node.target.style('backgroundColor', hoveredGoTermColor);
		return `
			<div>
				<span>Symbol: </span><strong>${node.target[0]._private.data.id}</strong><br/><div style="padding: 4px"></div>
				<span>Name: </span><strong>${info.name}</strong><br/><div style="padding: 4px"></div>
				<span>NameSpace: </span><strong>${info.namespace}</strong><br/><div style="padding: 4px"></div>
				<span>Description: </span><strong>${info.description}</strong>
			</div>
		`;
	}
}

function changeNodeColor(node) {
	const {
		data: { info }
	} = node.target[0]._private;
	if (info.class === 'Gene') node.target.style('backgroundColor', geneColor);
	if (info.class === 'GOAnnotation')
		node.target.style('backgroundColor', goTermColor);
}

export {
	createTooltip,
	createTooltipData,
	getGraphData,
	changeNodeColor,
	createCytoscapeConfig
};
