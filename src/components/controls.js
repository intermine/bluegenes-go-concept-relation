import React from 'react';

const FilterPanel = ({ updateFilters }) => {
	return (
		<div className="filter-panel-root">
			<h4 className="filter-panel-title">Ontology Filter</h4>
			<div className="filter-panel">
				<div className="filter-container">
					<input
						type="radio"
						id="biological_process"
						value="biological_process"
						onChange={updateFilters}
					/>
					<label htmlFor="biological_process">biological_process</label>
					<div className="nextLine"></div>
					<input
						type="radio"
						id="cellular_process"
						value="cellular_process"
						onChange={updateFilters}
					/>
					<label htmlFor="cellular_process">cellular_process</label>
					<div className="nextLine"></div>
					<input
						type="radio"
						id="molecular_function"
						value="molecular_function"
						onChange={updateFilters}
					/>
					<label htmlFor="molecular_function">molecular_function</label>
				</div>
			</div>
		</div>
	);
};

export default FilterPanel;
