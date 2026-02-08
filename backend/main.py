from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/trends")
def get_trends():
    try:
        tech_stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']
        
        data = yf.download(tech_stocks, period='1mo', interval='1d', threads=False)
        
        df = data['Close']
        
        df_filled = df.ffill() 
        
        normalized = (df_filled / df_filled.iloc[0] * 100).round(2)
        
        normalized.reset_index(inplace=True)
        normalized['Date'] = normalized['Date'].dt.strftime('%Y-%m-%d')
        
        return normalized.to_dict(orient='records')
        
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)