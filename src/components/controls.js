import React from 'react';

const FilterPanel = () => {
	return (
		<div className="filter-panel-root">
			<h4 className="filter-panel-title">Ontology Filter</h4>
			<div className="filter-panel">
				<div className="filter-container">
					<input type="radio" value="biological_process" />
					<label value="biological_process">biological_process</label>
					<div className="nextLine"></div>
					<input type="radio" value="cellular_process" />
					<label value="cellular_process">cellular_process</label>
					<div className="nextLine"></div>
					<input type="radio" value="molecular_functio" />
					<label value="molecular_function">molecular_function</label>
				</div>
			</div>
		</div>
	);
};

export default FilterPanel;
