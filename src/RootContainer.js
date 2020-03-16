import React, { useState, useEffect } from 'react';
import { queryData } from './query';
import GeneOntologyNetwork from './components/GeneOntologyNetwork';
import Controls from './components/Controls';
import Loading from './components/Loading';

const RootContainer = ({ serviceUrl }) => {
	const [data, setData] = useState([]);
	const [selectedOntology, changeOntology] = useState('biological_process');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		queryData({
			serviceUrl: serviceUrl,
			geneId: '1205472,128,2314',
			ontology: selectedOntology
		}).then(data => {
			setData(data);
			setLoading(false);
		});
	}, selectedOntology);

	return (
		<div className="rootContainer">
			{loading ? (
				<Loading />
			) : data.length ? (
				<div className="innerContainer">
					<div className="graph">
						<span className="chart-title">Go Concept Relation</span>
						<GeneOntologyNetwork data={data} />
					</div>
					<div className="controls">
						<Controls
							updateFilters={ev => changeOntology(ev.target.value)}
							selectedOntology={selectedOntology}
						/>
					</div>
				</div>
			) : (
				<h1>No Data Found</h1>
			)}
		</div>
	);
};

export default RootContainer;
