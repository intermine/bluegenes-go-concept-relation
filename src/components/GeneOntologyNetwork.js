import React, { useEffect } from 'react';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
import {
	createTooltip,
	createTooltipData,
	getGraphData,
	changeNodeColor,
	createCytoscapeConfig
} from '../utils';

cytoscape.use(coseBilkent);

function GeneOntologyNetwork({ data }) {
	useEffect(() => {
		let cy = cytoscape(createCytoscapeConfig(getGraphData(data)));
		let div;
		let node = cy.elements().nodes();
		node.unbind('mouseover');
		node.bind('mouseover', event => {
			document.body.style.cursor = 'pointer';
			div = createTooltip(event.renderedPosition, createTooltipData(event));
		});
		node.unbind('mouseout');
		node.bind('mouseout', event => {
			document.body.style.cursor = 'default';
			div.style.display = 'none';
			changeNodeColor(event);
		});
	}, [data]);
	return <div id="cy" style={{ height: 500, position: 'relative' }}></div>;
}

export default GeneOntologyNetwork;
