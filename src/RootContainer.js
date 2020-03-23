import React, { useState, useEffect } from 'react';
import { queryData } from './query';
import GeneOntologyNetwork from './components/GeneOntologyNetwork';
import Controls from './components/Controls';
import Loading from './components/Loading';

const RootContainer = ({ serviceUrl }) => {
	const [data, setData] = useState([]);
	const [ontologyList, setOntologyList] = useState([]);
	const [selectedOntology, changeOntology] = useState('');
	const [selectedOntologyData, setOntologyData] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		queryData({
			serviceUrl: serviceUrl,
			geneId: '1205472,128,2314'
		}).then(data => {
			setData(data);
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		const uniqueOntologies = new Set();
		data.forEach(d =>
			d.goAnnotation.forEach(g => {
				uniqueOntologies.add(g.ontologyTerm.namespace);
			})
		);
		setOntologyList([...uniqueOntologies]);
	}, [data]);

	useEffect(() => {
		const filteredMap = ontologyList.reduce(
			(curMap, ontology) => ({
				...curMap,
				[ontology]: data.map(item => ({
					...item,
					goAnnotation: item.goAnnotation.filter(
						g => g.ontologyTerm.namespace === ontology
					)
				}))
			}),
			{}
		);
		setOntologyData(filteredMap);
		changeOntology(ontologyList.length && ontologyList[0]);
	}, [ontologyList]);

	return (
		<div className="rootContainer">
			{loading ? (
				<Loading />
			) : Object.keys(selectedOntologyData).length ? (
				<div className="innerContainer">
					<div className="graph">
						<span className="chart-title">Go Concept Relation</span>
						<GeneOntologyNetwork
							data={selectedOntologyData[selectedOntology]}
						/>
					</div>
					{ontologyList.length ? (
						<div className="controls">
							<Controls
								updateFilters={ev => changeOntology(ev.target.value)}
								selectedOntology={selectedOntology}
								ontologyList={ontologyList}
							/>
						</div>
					) : (
						<></>
					)}
				</div>
			) : (
				<h1>No Data Found</h1>
			)}
		</div>
	);
};

export default RootContainer;
