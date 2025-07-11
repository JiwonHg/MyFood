'''
    aa84f714c1ca487d9375
    conda install conda-forge::fastapi
    conda install conda-forge::sqlalchemy
    conda install -c conda-forge psycopg2
    uvicorn main:app --host 0.0.0.0 --port 5050 --reload
    gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:5050
'''

from fastapi import FastAPI, Request, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, Float, select, cast, Date, inspect
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import sys
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인에서의 접근을 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DATABASE_URL = os.getenv(
    'DATABASE_URL', "postgresql://postgres:hagyeong0922@15.165.192.210:5432/myfood_dev")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Nutrition(Base):
    __tablename__ = 'integrated_food_nutrition_information'
    food_cd = Column(String, primary_key=True, index=True)
    food_nm = Column(String)  # String corresponds to TEXT in PostgreSQL
    energy = Column(String)  # 영양성분함량기준량
    nut_con_srtr_qua = Column(Float)  # 에너지(kcal)
    water = Column(Float)  # 수분(g)
    prot = Column(Float)  # 단백질(g)
    fatce = Column(Float)  # 지방(g)
    ash = Column(Float)  # 회분(g)
    chocdf = Column(Float)  # 탄수화물(g)
    sugar = Column(Float)  # 당류(g)
    fibtg = Column(Float)  # 식이섬유(g)
    ca = Column(Float)  # 칼슘(mg)
    fe = Column(Float)  # 철(mg)
    p = Column(Float)  # 인(mg)
    k = Column(Float)  # 칼륨(mg)
    nat = Column(Float)  # 나트륨(mg)
    vita_rae = Column(Float)  # 비타민 A(μg RAE)
    retinol = Column(Float)  # 레티놀(μg)
    cartb = Column(Float)  # 베타카로틴(μg)
    thia = Column(Float)  # 티아민(mg)
    ribf = Column(Float)  # 리보플라빈(mg)
    nia = Column(Float)  # 니아신(mg)
    vitc = Column(Float)  # 비타민 C(mg)
    vitd = Column(Float)  # 비타민 D(μg)
    chole = Column(Float)  # 콜레스테롤(mg)
    fasat = Column(Float)  # 포화지방산(g)
    fatrn = Column(Float)  # 트랜스지방산(g)
    refuse = Column(Float)  # 폐기율(%)
    src_cd = Column(String)  # 출처코드
    src_nm = Column(String)  # 출처명
    food_size = Column(String)  # 식품중량
    impt_yn = Column(String)  # 수입여부
    coo_cd = Column(String)  # 원산지국코드
    coo_nm = Column(String)  # 원산지국명
    company_nm = Column(String)  # 업체명
    data_prod_cd = Column(String)  # 데이터생성방법코드
    data_prod_nm = Column(String)  # 데이터생성방법명
    crt_ymd = Column(Date)  # 데이터생성일자
    crtr_ymd = Column(Date)  # 데이터기준일자


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/api/nutrition/{food_name}", response_model=list)
def read_nutrition(food_name: str, db: Session = Depends(get_db)):
    food_name = f"%{food_name}%"
    try:
        statement = select(Nutrition).where(Nutrition.food_nm.like(food_name))
        results = db.execute(statement).scalars().all()

        if not results:
            raise HTTPException(status_code=404, detail="Food not found")

        return [
            {
                "food_nm": result.food_nm,
                "energy": result.energy,
                "nut_con_srtr_qua": result.nut_con_srtr_qua,
                "water": result.water,
                "prot": result.prot,
                "fatce": result.fatce,
                "ash": result.ash,
                "chocdf": result.chocdf,
                "sugar": result.sugar,
                "fibtg": result.fibtg,
                "ca": result.ca,
                "fe": result.fe,
                "p": result.p,
                "k": result.k,
                "nat": result.nat,
                "vita_rae": result.vita_rae,
                "retinol": result.retinol,
                "cartb": result.cartb,
                "thia": result.thia,
                "ribf": result.ribf,
                "nia": result.nia,
                "vitc": result.vitc,
                "vitd": result.vitd,
                "chole": result.chole,
                "fasat": result.fasat,
                "fatrn": result.fatrn,
                "refuse": result.refuse,
                "src_cd": result.src_cd,
                "src_nm": result.src_nm,
                "food_size": result.food_size,
                "impt_yn": result.impt_yn,
                "coo_cd": result.coo_cd,
                "coo_nm": result.coo_nm,
                "company_nm": result.company_nm,
                "data_prod_cd": result.data_prod_cd,
                "data_prod_nm": result.data_prod_nm,
                "crt_ymd": result.crt_ymd,
                "crtr_ymd": result.crtr_ymd
            } for result in results
        ]
    except Exception as e:
        # 예외 발생 시 500 에러 대신 구체적인 오류 메시지와 함께 500 에러 반환
        raise HTTPException(
            status_code=500, detail=f"Internal Server Error: {str(e)}")


@app.get("/")
async def read_root(request: Request):
    return {"Hello": "World"}

if __name__ == '__main__':
    try:
        uvicorn.run("main:app", host="0.0.0.0", port=5050, reload=True)
    except Exception as e:
        print(e)
    finally:
        print('Server stopped')
