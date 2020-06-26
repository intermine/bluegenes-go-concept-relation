import React, { useState, useEffect } from 'react';
import { queryData } from './query';
import GeneOntologyNetwork from './components/GeneOntologyNetwork';
import Controls from './components/Controls';
import Loading from './components/Loading';

const RootContainer = ({ serviceUrl, entity }) => {
	const [data, setData] = useState([]);
	const [ontologyList, setOntologyList] = useState([]);
	const [selectedOntology, changeOntology] = useState('');
	const [selectedOntologyData, setOntologyData] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		let { value } = entity;
		queryData({
			serviceUrl: serviceUrl,
			// supporting single entity also by converting value into array and passing it to get queried
			geneId: !Array.isArray(value) ? [value] : value
		}).then(data => {
			setData(data);
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		const uniqueOntologies = new Set();
		// extracting unique ontologies from the query response to show it for filtering
		data.forEach(
			d =>
				d &&
				d.goAnnotation &&
				d.goAnnotation.forEach(g => {
					uniqueOntologies.add(g.ontologyTerm.namespace);
				})
		);
		setOntologyList([...uniqueOntologies]);
	}, [data]);

	useEffect(() => {
		// Formatting data according to the unique ontologies so that it can be passed directly to the graph 
		// when filter is applied. Setting the data in advance will allow us to use it directly when needed  
		// instead of processing it whenever filter is changed
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
		// set default selected ontology to the first ontology mentioned in the list
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
