# init_db.py - initialize SQLite DB with some demo data
import sqlite3, random
from datetime import datetime, timedelta

DB='expense.db'
conn = sqlite3.connect(DB)
cur = conn.cursor()
cur.execute('''
CREATE TABLE IF NOT EXISTS expenses (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 date TEXT,
 category TEXT,
 amount REAL,
 notes TEXT
)
''')
conn.commit()

# Insert sample data (6 months) - optional; safe to run multiple times
cats = ['Food','Travel','Rent','Subscriptions','Shopping','Others']
start = datetime.now()
rows=[]
for m in range(6,0,-1):
    base = (start - timedelta(days=30*m)).replace(day=1)
    for i in range(18):
        d = base + timedelta(days=random.randint(0,25))
        cat = random.choice(cats)
        amt = round(random.uniform(30,1200) if cat!='Rent' else random.uniform(5000,9000),2)
        rows.append((d.strftime('%Y-%m-%d'), cat, amt, 'demo'))
cur.executemany("INSERT INTO expenses (date,category,amount,notes) VALUES (?,?,?,?)", rows)
conn.commit()
conn.close()
print("DB initialized (expense.db).")  
