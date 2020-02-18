import React, { useState, useEffect } from 'react';
import { queryData } from './query';
import GeneOntologyNetwork from './components/GeneOntologyNetwork';

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
			{data.length ? <GeneOntologyNetwork data={data} /> : <h1>Loading...</h1>}
		</div>
	);
};

export default RootContainer;
