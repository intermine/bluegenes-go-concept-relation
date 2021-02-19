import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
import {
	createTooltip,
	createTooltipData,
	getGraphData,
	createCytoscapeConfig
} from '../utils';

cytoscape.use(coseBilkent);

// If we don't disable warnings, we'll get spammed with:
// The style property `pie-49-background-color: #D4AC0D` is invalid
// The style property `pie-49-background-size: 1.6666666666666667` is invalid
// I'm guessing it's because those portions of the pie chart end up not getting
// used, but I haven't dived deep enough to find a fix.
cytoscape.warnings(false);

function GeneOntologyNetwork({ data }) {
	const cyEl = useRef(null);
	const [hasConfirmed, setConfirmed] = useState(false);
	const [showDialog, setDialog] = useState(false);

	useEffect(() => {
		const elements = getGraphData(data || []);
		if (elements.length > 1000 && !hasConfirmed) {
			setDialog(true);
			return;
		}

		if (!elements.length) return;

		if (showDialog) setDialog(false);
		let cy = cytoscape(createCytoscapeConfig(elements, cyEl));
		let div;
		let node = cy.elements().nodes();
		node.unbind('mouseover');
		node.bind('mouseover', event => {
			div = createTooltip(
				cyEl,
				event.renderedPosition,
				createTooltipData(event)
			);
			document.body.appendChild(div);
		});
		node.unbind('mouseout');
		node.bind('mouseout', () => {
			document.body.removeChild(div);
		});
	}, [data, hasConfirmed]);

	const onConfirm = () => {
		setConfirmed(true);
		setDialog(false);
	};

	const onClose = () => {
		setDialog(false);
	};

	return (
		<>
			<div className="cyContainer" ref={cyEl}></div>
			{showDialog && (
				<div className="confirmation-dialog">
					<p>
						Running this visualizer with the current input data will render a
						network graph with a high amount of nodes. This can take a while and
						might result in a graph that isn&apos;t very useful. Do you still
						wish to continue?
					</p>
					<button className="confirm-button" type="button" onClick={onConfirm}>
						Yes, load graph
					</button>
					<button type="button" onClick={onClose}>
						No, close dialog
					</button>
				</div>
			)}
		</>
	);
}

export default GeneOntologyNetwork;
