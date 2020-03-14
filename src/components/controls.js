import React from 'react';

const FilterPanel = ({ updateFilters }) => {
	const ontologyTerms = [
		'biological_process',
		'cellular_process',
		'molecular_function'
	];
	return (
		<div className="filter-panel-root">
			<h4 className="filter-panel-title">Ontology Filter</h4>
			<div className="filter-panel">
				<div className="filter-container">
					{ontologyTerms.map(term => (
						<>
							<input
								type="radio"
								id={term}
								value={term}
								onChange={updateFilters}
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
