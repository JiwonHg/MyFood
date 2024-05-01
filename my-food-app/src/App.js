import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [foodCd, setFoodCd] = useState('');
  const [nutritionData, setNutritionData] = useState(null);
  const [error, setError] = useState('');

  const fetchNutritionData = async () => {
    setError(''); // Clear previous errors
    setNutritionData(null); // Clear previous data
    try {
      const response = await axios.get(`http://localhost:5050/nutrition/${foodCd}`);
      console.log("console log:", response.data);  // Log the response data to the console
      setNutritionData(response.data);

      if (response && response.data) {
        setNutritionData(response.data);
        console.log("Fetched data:", response.data);  // Log the response data to the console
      } else {
        throw new Error('Received empty data');
      }

      console.log("console Food name:", nutritionData.food_nm);
      console.log("console Energy:", nutritionData.energy);
      console.log("console Protein:", nutritionData.prot);
      console.log("console Cholesterol:", nutritionData.chole);
    } catch (err) {
      setError('Failed to fetch data. Please check the food code.');
      console.error(err);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchNutritionData();
  };

  return (
    <div className="App">
      <h1>Nutrition Information Viewer</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Food Code:
          <input
            type="text"
            value={foodCd}
            onChange={(e) => setFoodCd(e.target.value)}
            placeholder="Enter food code"
          />
        </label>
        <button type="submit">Fetch Nutrition</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {nutritionData ? (
        <div>
          <h2>Food Name: {nutritionData}</h2>  {/* Access food_nm only here */}
          <ul>
            <li>Energy: {nutritionData.energy}</li>
            <li>Protein: {nutritionData.prot}</li>
            <li>Cholesterol: {nutritionData.chole}</li>
            {/* Add other nutrition fields as needed */}
          </ul>
        </div>
      ) : (
        <p>No nutrition data to display.</p>
      )}
    </div>
  );
}

export default App;
