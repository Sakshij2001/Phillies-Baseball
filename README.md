# MLB Qualifying Offer Calculator

A full-stack web application that calculates the MLB qualifying offer value by analyzing the top 125 player salaries from live data. The qualifying offer is a critical mechanism in baseball's free agency system, and this tool provides real-time calculations along with comprehensive data visualizations and analytics.

## Overview

In baseball, teams can extend a **qualifying offer** to departing free agents—a one-year contract valued at the average of the 125 highest salaries from the previous season. This application:

- Fetches live salary data from the MLB dataset
- Calculates the qualifying offer in real-time
- Handles corrupted/malformed data entries
- Provides interactive visualizations and statistical insights
- Displays data quality metrics and salary distribution

##  Features

- **Real-time Calculation**: Fetches fresh data on each request to ensure accurate qualifying offer values
- **Data Quality Metrics**: Tracks total records, valid entries, and corrupted data
- **Interactive Dashboard**: Modern UI with salary distribution charts
- **Statistical Analysis**: Displays median, min, and max salaries from top 125
- **Error Handling**: Robust handling of malformed data without affecting calculations
- **Responsive Design**: Clean, professional interface optimized for all screen sizes

## Tech Stack

**Backend:**
- Python 3.8+
- FastAPI (web framework)
- BeautifulSoup4 (HTML parsing)
- Requests (HTTP client)
- Uvicorn (ASGI server)

**Frontend:**
- React 19 with TypeScript
- Vite (build tool)
- Recharts (data visualization)
- Modern CSS (no external UI libraries)

## Prerequisites

Before running this application, ensure you have the following installed:

- **Python 3.8 or higher** ([Download Python](https://www.python.org/downloads/))
- **Node.js 18.0 or higher** ([Download Node.js](https://nodejs.org/))
- **npm** (comes with Node.js)

To verify your installations:
```bash
python --version  # Should show Python 3.8+
node --version    # Should show v18.0+
npm --version     # Should show 8.0+
```

## Installation & Setup

### Step 1: Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd mlb-qualifying-offer

# Or extract the ZIP file and navigate to the directory
cd mlb-qualifying-offer
```

### Step 2: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
uvicorn main:app --reload --port 5000
```

The backend API will be available at `http://127.0.0.1:5000`

** Backend is ready when you see:**
```
INFO:     Uvicorn running on http://127.0.0.1:5000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Step 3: Frontend Setup

**Open a new terminal window** (keep the backend running) and:

1. Navigate to the frontend directory:
```bash
cd frontend  # If you're in the root directory
# OR
cd ../frontend  # If you're in the backend directory
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will automatically open in your browser at `http://localhost:3000`

** Frontend is ready when you see:**
```
VITE v5.4.21  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
➜  press h + enter to show help
```

## 🎯 Usage

1. **Access the Application**: Open your browser to `http://localhost:3000`

2. **View the Qualifying Offer**: The main dashboard displays:
   - Current qualifying offer value (average of top 125 salaries)
   - Data quality metrics (total, valid, used, corrupted records)
   - Bar chart showing top 10 salaries
   - Statistical context (median, min, max)

3. **Refresh Data**: Click the "Fetch Latest Data" button to pull fresh data from the source

4. **Monitor Status**: The status indicator shows:
   - 🟢 **ON**: Data successfully loaded
   - 🔴 **ERROR**: Connection or data issue
   - 🟡 **LOADING**: Fetching data

## Project Structure

```
mlb-qualifying-offer/
├── backend/
│   ├── main.py              # FastAPI application with data fetching/processing
│   └── requirements.txt     # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── App.tsx         # Main React component with UI
    │   └── main.tsx        # React entry point
    ├── index.html          # HTML template
    ├── package.json        # Node.js dependencies
    ├── tsconfig.json       # TypeScript configuration
    └── vite.config.ts      # Vite build configuration
```

## How It Works

### Backend Process (`main.py`)

1. **Data Fetching**: Sends HTTP request to `https://questionnaire-148920.appspot.com/swe/data.html`
2. **HTML Parsing**: Uses BeautifulSoup to extract salary table
3. **Data Cleaning**:
   - Extracts numeric values using regex pattern `\d[\d,]*`
   - Removes commas and converts to float
   - Tracks corrupted entries that can't be parsed
4. **Calculation**:
   - Sorts salaries in descending order
   - Selects top 125 salaries
   - Computes mean (qualifying offer)
   - Calculates additional statistics (median, min, max)
5. **API Response**: Returns JSON with all calculated values

### Frontend Process (`App.tsx`)

1. **Data Fetching**: Makes GET request to backend API endpoint
2. **State Management**: Uses React hooks (useState, useEffect) to manage:
   - Application data
   - Loading states
   - Error conditions
3. **Visualization**: Uses Recharts library to render interactive bar chart
4. **UI Updates**: Displays metrics, charts, and status in real-time

## Error Handling

The application implements comprehensive error handling:

### Backend
- ✅ Network timeout protection (10-second limit)
- ✅ HTML parsing validation (checks for table existence)
- ✅ Corrupted data tracking and reporting
- ✅ Empty dataset validation
- ✅ Exception catching with descriptive error messages

### Frontend
- ✅ Network error handling
- ✅ Loading state indicators
- ✅ Error message display
- ✅ Graceful degradation (shows last valid data)
- ✅ Status monitoring (ON/ERROR/LOADING)

### Data Quality
- ✅ Handles malformed salary values without breaking calculation
- ✅ Regex pattern matching for flexible number extraction
- ✅ Removes non-numeric characters (commas, dollar signs)
- ✅ Reports data quality metrics (corrupted count)

## Example Output

```json
{
  "qualifyingOffer": 21476500.0,
  "total": 150,
  "used": 125,
  "valid": 148,
  "corrupted": 2,
  "top10": [45000000, 43000000, 40000000, ...],
  "min_salaries": 16000000,
  "max_salaries": 45000000,
  "median_salaries": 21500000
}
```

## Code Attribution

This project uses the following resources and patterns:

- **BeautifulSoup HTML Parsing**: [Official Documentation](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
- **Regex Number Extraction**: Pattern inspired by [Stack Overflow](https://stackoverflow.com/questions/1450897/remove-characters-except-digits-from-string-using-python)
- **FastAPI CORS Configuration**: [FastAPI CORS Documentation](https://fastapi.tiangolo.com/tutorial/cors/)
- **React + TypeScript**: [Official React TypeScript Documentation](https://react.dev/learn/typescript)
- **Recharts Visualization**: [Recharts Documentation](https://recharts.org/)

## Key Implementation Details

1. **Live Data**: Application fetches fresh data on each request (no caching)
2. **Data Validation**: Malformed entries are tracked but don't interfere with calculations
3. **Precision**: All calculations use floating-point arithmetic for accuracy
4. **User Experience**: Loading states and error messages keep users informed
5. **Code Quality**: Type-safe TypeScript, clear variable names, comprehensive comments

## Future Enhancements

- Historical tracking of qualifying offer trends
- Player name association with salaries
- Export data to CSV/Excel
- Advanced filtering and sorting options
- Mobile-responsive optimizations
- Unit and integration tests
- Docker containerization
