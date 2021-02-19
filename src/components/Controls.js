import React from 'react';

const FilterPanel = ({
	updateFilters,
	selectedOntology,
	ontologyList,
	updateToggle,
	toggleStatus
}) => {
	return (
		<div className="filter-panel-root">
			<div className="filter-panel">
				<div className="filter-container">
					<div className="node-filter">
						<div>Shared Nodes:</div>
						<div>
							<label className="switch">
								<input
									type="checkbox"
									value={toggleStatus}
									onChange={updateToggle}
									checked={toggleStatus}
								/>
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
