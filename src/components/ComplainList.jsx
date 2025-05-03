
import complains from '../../complains.json'
import ComplainCard from './ComplainCard'
import React, { useState } from "react";


const ComplainList = () => {
  const [filterText, setFilterText] = useState(""); // State to track the text entered for filter

  // Handle the filter text change
  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  // Filter complaints based on the title (name)
  const filteredComplains = complains.filter((complain) =>
    complain.location.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      <section className="complain-list-section">
        <div>
          <h2 className="complain-list-h1">Complain List</h2>
          
          {/* Input for filter by title */}
          <div>
            <label htmlFor="filterByName">Filter by Location: </label>
            <input
              type="text"
              id="filterByName"
              placeholder="Enter violation location"
              value={filterText}
              onChange={handleFilterChange}
            />
          </div>
          
          <div>
            {filteredComplains.map((complain) => (
              <ComplainCard key={complain.id} violation={complain} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComplainList;