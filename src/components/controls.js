import React from 'react';

const FilterPanel = ({ updateFilters, selectedOntology, ontologyList }) => {
	return (
		<div className="filter-panel-root">
			<h4 className="filter-panel-title">Available Ontologies</h4>
			<div className="filter-panel">
				<div className="filter-container">
					{ontologyList.map(term => (
						<>
							<input
								type="radio"
								id={term}
								value={term}
								onChange={updateFilters}
								checked={selectedOntology === term}
							/>
							<label htmlFor={term}>{term}</label>
							<div className="nextLine"></div>
						</>
					))}
				</div>
			</div>
		</div>
	);
};

export default FilterPanel;
