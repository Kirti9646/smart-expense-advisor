# train_model.py - trains a simple RandomForest on monthly aggregates
import sqlite3, pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
conn = sqlite3.connect('expense.db')
df = pd.read_sql_query("SELECT date, amount FROM expenses", conn)
df['date'] = pd.to_datetime(df['date'])
monthly = df.set_index('date').resample('M')['amount'].sum().reset_index()
monthly = monthly.reset_index(drop=True)
monthly['lag1'] = monthly['amount'].shift(1)
monthly['lag2'] = monthly['amount'].shift(2)
monthly['lag3'] = monthly['amount'].shift(3)
monthly = monthly.dropna()
if len(monthly) < 5:
    print("Not enough monthly data to train model. Add more transactions or skip training.")
else:
    X = monthly[['lag1','lag2','lag3']].values
    y = monthly['amount'].values
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X,y)
    joblib.dump(model, 'models/rf_model.pkl')
    print("Model trained and saved to models/rf_model.pkl")
conn.close()
