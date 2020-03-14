import React, { useState, useEffect } from 'react';
import { queryData } from './query';
import GeneOntologyNetwork from './components/GeneOntologyNetwork';
import Controls from './components/controls';

const RootContainer = ({ serviceUrl }) => {
	const [data, setData] = useState([]);
	const [selectedOntology, changeOntology] = useState('biological_process');

	useEffect(() => {
		queryData({
			serviceUrl: serviceUrl,
			geneId: '1205472,128,2314',
			ontology: selectedOntology
		}).then(data => {
			setData(data);
			document.getElementById(selectedOntology).checked = true;
		});
	}, selectedOntology);

	function updateFilters(ev) {
		document.getElementById(selectedOntology).checked = false;
		changeOntology(ev.target.value);
	}

	return (
		<div className="rootContainer">
			{data.length ? (
				<div className="innerContainer">
					<div className="graph">
						<span className="chart-title">Go Concept Relation</span>
						<GeneOntologyNetwork data={data} />
					</div>
					<div className="controls">
						<Controls updateFilters={updateFilters} />
					</div>
				</div>
			) : (
				<h1>Loading...</h1>
			)}
		</div>
	);
};

export default RootContainer;
