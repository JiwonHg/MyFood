import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // CSS 파일 임포트

function App() {
  const [foodName, setFoodName] = useState('');
  const [nutritionData, setNutritionData] = useState([]);
  const [error, setError] = useState('');

  const fetchNutritionData = async () => {
    setError('');
    setNutritionData([]);
    try {
      const response = await axios.get(`http://localhost:5050/nutrition/${foodName}`);
      if (response.data) {
        setNutritionData(response.data);
      } else {
        throw new Error('Received empty data');
      }
    } catch (err) {
      setError('Failed to fetch data. Please check the food name.');
      console.error(err);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchNutritionData();
  };

  return (
    <div className="App">
      <h1>주의성분 필터 식품 조회 서비스</h1>
      <form onSubmit={handleSubmit}>
        <label>
          제품명
          <input
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="Enter food name"
            style={{ marginLeft: '20px', marginRight: '20px' }} // 스타일 적용
          />
        </label>
        <button type="submit">조회</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {nutritionData.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Food Name</th>
              <th>Energy</th>
              <th>Protein</th>
              <th>Cholesterol</th>
            </tr>
          </thead>
          <tbody>
            {nutritionData.map((item, index) => (
              <tr key={index}>
                <td>{item.food_nm}</td>
                <td>{item.energy} kcal</td>
                <td>{item.prot} g</td>
                <td>{item.chole} mg</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No nutrition data to display.</p>
      )}
    </div>
  );
}

export default App;
