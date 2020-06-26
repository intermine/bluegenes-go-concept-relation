import colors from './constant';

function getGraphData(data) {
	const elements = [];
	const colorArrLen = colors.length;
	// setting color of each gene node taking hex code color from constant file
	for (var i = 0; i < data.length; i++) {
		data[i].color = colors[i % colorArrLen];
	}
	data.forEach(el => {
		const {
			symbol,
			secondaryIdentifier,
			primaryIdentifier,
			organism,
			color
		} = el;
		elements.push({
			group: 'nodes',
			data: {
				id: el.symbol,
				bg: color,
				label: el.symbol,
				shape: 'barrel',
				info: {
					class: el.class,
					symbol,
					shortName: organism.shortName,
					primaryIdentifier,
					secondaryIdentifier
				}
			}
		});
		el.goAnnotation &&
			el.goAnnotation.forEach(e => {
				const { description, name, namespace } = e.ontologyTerm;
				elements.push({
					group: 'nodes',
					data: {
						id: e.ontologyTerm.identifier,
						bg: color,
						label: '',
						shape: 'ellipse',
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

function makePie(elements) {
	// creating array containting the colors each pie node needed
	const idToColorsMap = elements.reduce((m, elem) => {
		if (elem.data && elem.data.id) {
			if (!m[elem.data.id]) m[elem.data.id] = [];
			m[elem.data.id].push(elem.data.bg);
		}
		return m;
	}, {});
	// returning object containing all pie nodes with thier styles
	return Object.keys(idToColorsMap)
		.filter(key => idToColorsMap[key].length > 1)
		.map(id => {
			const pieNodeStyle = {};
			pieNodeStyle['selector'] = `node[id = '${id}']`;
			const style = {};
			const colorLen = idToColorsMap[id].length;
			for (let i = 1; i <= colorLen; i++) {
				style[`pie-${i}-background-color`] = idToColorsMap[id][i - 1];
				style[`pie-${i}-background-size`] = 100 / colorLen;
			}
			pieNodeStyle['style'] = style;
			return pieNodeStyle;
		});
}

function createCytoscapeConfig(elements) {
	return {
		container: document.getElementById('cy'),
		elements: elements,
		grabbable: true,
		style: [
			...makePie(elements),
			{
				selector: 'node',
				style: {
					label: 'data(label)',
					'background-color': 'data(bg)',
					shape: 'data(shape)'
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

export {
	createTooltip,
	createTooltipData,
	getGraphData,
	createCytoscapeConfig
};
