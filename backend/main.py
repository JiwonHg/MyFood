'''
    aa84f714c1ca487d9375
    conda install conda-forge::fastapi
    conda install conda-forge::uvicorn
    conda install conda-forge::sqlalchemy
    conda install -c conda-forge psycopg2

'''

from fastapi import FastAPI, Request, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, Float, select, cast
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import sys
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # Specifies which origins should be allowed to make requests
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Database setup
DATABASE_URL = os.getenv(
    'DATABASE_URL', "postgresql://postgres:hagyeong0922@localhost/myfood_dev")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Nutrition(Base):
    __tablename__ = 'integrated_food_nutrition_information'
    # Should be a text-like field (String)
    food_cd = Column(String, primary_key=True, index=True)
    food_nm = Column(String)  # String corresponds to TEXT in PostgreSQL
    # Make sure this is supposed to be a Float and the DB also says so
    energy = Column(String)
    prot = Column(Float)    # Same as above
    chole = Column(Float)   # Same as above


Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/nutrition/{food_name}", response_model=list)
def read_nutrition(food_name: str, db: Session = Depends(get_db)):
    food_name = f"%{food_name}%"  # 입력받은 제품명 양 옆에 %를 추가하여 LIKE 검색을 위한 준비
    statement = select(Nutrition).where(Nutrition.food_nm.like(food_name))
    results = db.execute(statement).all()
    print(results)
    if results:
        return [
            {
                "food_nm": result.Nutrition.food_nm,
                "energy": result.Nutrition.energy,
                "prot": result.Nutrition.prot,
                "chole": result.Nutrition.chole
            } for result in results
        ]
    else:
        raise HTTPException(status_code=404, detail="Food not found")


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
