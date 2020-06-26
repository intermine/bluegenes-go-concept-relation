import React from 'react';

const FilterPanel = ({ updateFilters, selectedOntology, ontologyList }) => {
	return (
		<div className="filter-panel-root">
			<h4 className="filter-panel-title">Filter Panel</h4>
			<hr />
			<div className="filter-panel">
				<div className="filter-container">
					<div className="node-filter">
						<div>All Nodes:</div>
						<div>
							<label className="switch">
								<input type="checkbox" />
								<span className="slider round"></span>
							</label>
						</div>
					</div>
					<div className="ontology-filter">Available Ontologies:</div>
					{ontologyList.map(term => (
						<React.Fragment key={term}>
							<input
								type="radio"
								id={term}
								value={term}
								onChange={updateFilters}
								checked={selectedOntology === term}
							/>
							<label htmlFor={term}>{term}</label>
							<div className="nextLine"></div>
						</React.Fragment>
					))}
				</div>
			</div>
		</div>
	);
};

export default FilterPanel;
