# 📈 Stock Investment Simulator

## Project Description

The **Stock Investment Simulator** is a full-stack web application built with **Node.js** that allows users to simulate the performance of a **$100 investment** over a selected timeframe using real-world historical stock data.

Users can search for valid stock tickers, visualize return-on-investment (ROI) trends, and manage a persistent **watchlist** stored in a **Supabase (PostgreSQL)** database. The application demonstrates client–server interaction, third-party API integration, and full deployment to a production environment.

---

## Target Browsers

This application is designed for modern desktop browsers:

- Google Chrome (latest)
- Mozilla Firefox (latest)
- Apple Safari (latest)
- Microsoft Edge (latest)

---

## Developer Manual

> **Audience:**  
> This section is intended for future developers who will maintain or extend the application.  
> Readers are assumed to have general knowledge of web development but no prior familiarity with this system.

---

## 1. Installation & Dependencies

### Prerequisites

- Node.js (v18 or later recommended)
- npm
- Supabase account
- Alpha Vantage API key

### Install Dependencies

From the project root directory, run:

\`\`\`bash
npm install
\`\`\`

---

## 2. Environment Configuration

Create a `.env` file in the project root directory:

\`\`\`env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_public_key
ALPHA_VANTAGE_KEY=your_alpha_vantage_api_key
\`\`\`

---

## 3. Database Setup (Supabase)

1. Create a new Supabase project
2. Create a table named `watchlist`
3. Add the following column:
   - `symbol` (text)
4. Disable **Row Level Security (RLS)** for public access

---

## 4. Running the Application

To start the server locally:

\`\`\`bash
node server.js
\`\`\`

The application will be available at:

\`\`\`
http://localhost:3000
\`\`\`

---

## 5. API Endpoints

### GET `/api/watchlist`

- Retrieves all stock symbols stored in the database
- Used to populate the watchlist on page load

### POST `/api/watchlist`

- Adds a new stock ticker to the database
- Includes duplicate symbol validation

### GET `/api/stock/:symbol`

- Retrieves historical stock data from Alpha Vantage
- Calculates return on investment (ROI)
- Returns processed data to the client

---

## 6. Business Logic

### ROI Calculation

\`\`\`
V_final = 100 × (P_current / P_initial)
\`\`\`

---

## 7. Front-End Architecture

- All data is retrieved using the **Fetch API**
- Multiple fetch requests are used to:
  - Load the watchlist
  - Retrieve stock data
  - Add new symbols
- Styled using modern CSS

### JavaScript Libraries Used

- **Chart.js**
- **Anime.js**

---

## 8. Known Limitations

- Alpha Vantage free tier allows **5 requests per minute**
- If exceeded:
  - Prices may display **"Limit Reached"**
  - Values may default to `$100`
- Database logic remains unaffected

---

## 9. Deployment

- Deployed using **Vercel**
- Auto-deploys on push to `main`
