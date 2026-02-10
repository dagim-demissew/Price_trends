from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd
from datetime import datetime

app = FastAPI(title="Mayerfeld Insights API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']

@app.get("/api/trends")
async def get_trends():
    try:
        # Fetching data with group_by to handle MultiIndex columns
        data = yf.download(TICKERS, period='1mo', interval='1d', auto_adjust=True)
        
        if data.empty:
            raise HTTPException(status_code=404, detail="No data found")

        # Extract Close prices
        df = data['Close']
        
        # Fill missing values and normalize (Base 100)
        df_filled = df.ffill().bfill() 
        normalized = (df_filled / df_filled.iloc[0] * 100).round(2)
        
        # Format for Recharts
        normalized.reset_index(inplace=True)
        normalized['Date'] = normalized['Date'].dt.strftime('%b %d')
        
        return normalized.to_dict(orient='records')
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)