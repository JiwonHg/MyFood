import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // CSS 파일 임포트

function App() {
  const [foodName, setFoodName] = useState('');
  const [nutritionData, setNutritionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState('');
  const [filterCholesterol, setFilterCholesterol] = useState(false);

  const fetchNutritionData = async () => {
    setError('');
    setNutritionData([]);
    setFilteredData([]);
    try {
      const response = await axios.get('/api/nutrition/${foodName}');
      if (response.data) {
        setNutritionData(response.data);
        applyFilter(response.data, filterCholesterol);
      } else {
        throw new Error('Received empty data');
      }
    } catch (err) {
      setError('Failed to fetch data. Please check the food name.');
      console.error(err);
    }
  };

  const applyFilter = (data, filter) => {
    if (filter) {
      setFilteredData(data.filter(item => item.chole === 0));
    } else {
      setFilteredData(data);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchNutritionData();
  };

  const handleFilterChange = (event) => {
    const { checked } = event.target;
    setFilterCholesterol(checked);
    applyFilter(nutritionData, checked);
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
          />
        </label>
        <button type="submit">조회</button>
      </form>
      <label style={{ display: 'block', margin: '20px 0' }}>
        <input
          type="checkbox"
          checked={filterCholesterol}
          onChange={handleFilterChange}
        />
        콜레스테롤 함량이 0인 항목만 보기
      </label>
      {error && <p className="error">{error}</p>}
      {filteredData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th rowSpan="2">제품명</th>
              <th colSpan="5">주의성분</th>
              <th rowSpan="2">칼로리(100g당)</th>
              <th colSpan="3">탄단지(비중)</th>
              <th rowSpan="2">상세성분</th>
            </tr>
            <tr>
              <th>콜레스테롤(mg)</th>
              <th>당류(g)</th>
              <th>나트륨(mg)</th>
              <th>포화지방산(g)</th>
              <th>트랜스지방산(g)</th>
              <th>탄수화물(g)</th>
              <th>단백질(g)</th>
              <th>지방(g)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.food_nm}</td>
                <td className="right-align">{item.chole}</td>
                <td className="right-align">{item.sugar}</td>
                <td className="right-align">{item.nat}</td>
                <td className="right-align">{item.fasat}</td>
                <td className="right-align">{item.fatrn}</td>
                <td className="right-align">{item.nut_con_srtr_qua}</td>
                <td className="right-align">{item.chocdf}</td>
                <td className="right-align">{item.prot}</td>
                <td className="right-align">{item.fatce}</td>
                <td>아이콘</td>
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
