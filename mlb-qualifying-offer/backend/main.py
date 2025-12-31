from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests, re, statistics
from bs4 import BeautifulSoup
from datetime import datetime

app = FastAPI()

URL = "https://questionnaire-148920.appspot.com/swe/data.html"

# Enable CORS(Cross-Origin Resource Sharing) for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/data")
def get_data():
    try:
        html = requests.get(URL, timeout=10).text
        # Parse HTML using BeautifulSoup
        # Reference: BeautifulSoup documentation:
        # https://www.crummy.com/software/BeautifulSoup/bs4/doc/
        soup = BeautifulSoup(html, "html.parser")
        table = soup.find("table")
        if not table:
            return {"error": "Table not found"}

        # Reference: Common data cleaning patterns from Stack Overflow
        # https://stackoverflow.com/questions/1450897/remove-characters-except-digits-from-string-using-python

        salaries = []
        corrupted = 0   # track corrupted entries for data quality metrics

        for row in table.find_all("tr")[1:]:
            cells = row.find_all("td")
            if len(cells) < 2: 
                continue
            match = re.search(r"\d[\d,]*", cells[1].text)
            
            if match:
                salaries.append(float(match.group().replace(",", "")))
            else:
                corrupted += 1
            
        if not salaries:
            return {"error": "No valid salaries found"}

        salaries.sort(reverse=True)
        top = salaries[:125]
        qo = statistics.mean(top)

        return {
            "qualifyingOffer": qo,
            "total": len(salaries),
            "used": len(top),
            "valid": len(salaries)-corrupted,
            "top10": top[:10],
            "corrupted": corrupted,
            "min_salaries": min(top),
            "max_salaries": max(top),
            "median_salaries":statistics.median(top),
        }

    except Exception as e:
        return {"error": str(e)}
