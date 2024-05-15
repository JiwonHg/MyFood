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
              <th>foodNm</th>
              <th>energy</th>
              <th>nutConSrtrQua</th>
              <th>water</th>
              <th>prot</th>
              <th>fatce</th>
              <th>ash</th>
              <th>chocdf</th>
              <th>sugar</th>
              <th>fibtg</th>
              <th>ca</th>
              <th>fe</th>
              <th>p</th>
              <th>k</th>
              <th>nat</th>
              <th>vitaRae</th>
              <th>retinol</th>
              <th>cartb</th>
              <th>thia</th>
              <th>ribf</th>
              <th>nia</th>
              <th>vitc</th>
              <th>vitd</th>
              <th>chole</th>
              <th>fasat</th>
              <th>fatrn</th>
              <th>refuse</th>
              <th>srcCd</th>
              <th>srcNm</th>
              <th>foodSize</th>
              <th>imptYn</th>
              <th>cooCd</th>
              <th>cooNm</th>
              <th>companyNm</th>
              <th>dataProdCd</th>
              <th>dataProdNm</th>
              <th>crtYmd</th>
              <th>crtrYmd</th>
            </tr>
          </thead>
          <tbody>
            {nutritionData.map((item, index) => (
              <tr key={index}>
                <td>{item.food_nm}</td>
                <td>{item.energy} kcal</td>
                <td>{item.nut_con_srtr_qua} g</td>
                <td>{item.water} g</td>
                <td>{item.prot} g</td>
                <td>{item.fatce} g</td>
                <td>{item.ash} g</td>
                <td>{item.chocdf} g</td>
                <td>{item.sugar} g</td>
                <td>{item.fibtg} g</td>
                <td>{item.ca} mg</td>
                <td>{item.fe} mg</td>
                <td>{item.p} mg</td>
                <td>{item.k} mg</td>
                <td>{item.nat} mg</td>
                <td>{item.vita_rae} μg</td>
                <td>{item.retinol} μg</td>
                <td>{item.cartb} μg</td>
                <td>{item.thia} mg</td>
                <td>{item.ribf} mg</td>
                <td>{item.nia} mg</td>
                <td>{item.vitc} mg</td>
                <td>{item.vitd} μg</td>
                <td>{item.chole} mg</td>
                <td>{item.fasat} g</td>
                <td>{item.fatrn} g</td>
                <td>{item.refuse} %</td>
                <td>{item.src_cd}</td>
                <td>{item.src_nm}</td>
                <td>{item.food_size} g</td>
                <td>{item.impt_yn}</td>
                <td>{item.coo_cd}</td>
                <td>{item.coo_nm}</td>
                <td>{item.company_nm}</td>
                <td>{item.data_prod_cd}</td>
                <td>{item.data_prod_nm}</td>
                <td>{item.crt_ymd}</td>
                <td>{item.crtr_ymd}</td>
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
