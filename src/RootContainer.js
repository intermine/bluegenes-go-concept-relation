import React, { useState, useEffect } from 'react';
import { queryData } from './query';
import GeneOntologyNetwork from './components/GeneOntologyNetwork';
import Controls from './components/controls';

const RootContainer = ({ serviceUrl }) => {
	const [data, setData] = useState([]);
	useEffect(() => {
		queryData({
			serviceUrl: serviceUrl,
			geneId: '1205472,128,2314'
		}).then(data => {
			setData(data);
		});
	}, []);

	return (
		<div className="rootContainer">
			{data.length ? (
				<div className="innerContainer">
					<div className="graph">
						<span className="chart-title">Go Concept Relation</span>
						<GeneOntologyNetwork data={data} />
					</div>
					<div className="controls">
						<Controls />
					</div>
				</div>
			) : (
				<h1>Loading...</h1>
			)}
		</div>
	);
};

export default RootContainer;
