import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function App() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"ON" | "ERROR" | "LOADING">("ON");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

 const fetchData = () => {
  setLoading(true);
  setError("");
  setStatus("LOADING");

  fetch("http://127.0.0.1:5000/api/data")
    .then(res => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then(res => {
      setData(res);
      setLastUpdated(new Date());
      setStatus("ON");
    })
    .catch(() => {
      setError("Failed to fetch data");
      setStatus("ERROR");
      setData(null);
    })
    .finally(() => setLoading(false));
};

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ background: "#F4F7FB", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>

      {/* ================= HEADER ================= */}
      <header style={{
        background: "#002D72",
        padding: "26px 40px",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <h2 style={{ fontSize: 28, margin: 0 }}>⚾ MLB Qualifying Offer Dashboard</h2>

        <div style={{ display: "flex", gap: 15 }}>
          <button
            onClick={fetchData}
            style={{
              background: "#E81828",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600
            }}
          >
             Fetch Latest Data
          </button>

          <div style={{
            background: "#1AAE55",
            padding: "10px 16px",
            borderRadius: 30,
            fontWeight: 600
          }}>
            Status ● {status}
          </div>
        </div>
      </header>


      {/* ================= TOP SPOTLIGHT CARD ================= */}
      {data && !data.error && (
        <div style={{
          maxWidth: 1200,
          margin: "30px auto",
          background: "white",
          borderRadius: 14,
          padding: 28,
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)"
        }}>
          <h3 style={{ marginBottom: 6, fontSize: 20 }}> Qualifying Offer</h3>

          <div style={{ fontSize: 42, fontWeight: 800, color: "#1A9A4A" }}>
            ${data.qualifyingOffer.toLocaleString()}
          </div>

          <p style={{ marginTop: 6, fontSize: 14, color: "#666" }}>
            <ul>
               <li> Average of the Top 125 Salaries (Live Data)</li>
                <li>Player may accept or reject</li>
                <li>If rejected: Signing team forfeits a draft pick</li>
            </ul>
          </p>
        </div>
      )}


      {/* =============== ANALYTICS METRICS ROW =============== */}
      {data && (
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 20,
          padding: "0 20px",
          marginBottom: 35
        }}>
          {[
            { label: "Total Salaries", value: data.total, color: "#0052CC" },
            { label: "Valid Records", value: data.valid, color: "#148F3D" },
            { label: "Records Used", value: data.used, color: "#D39E00" },
            { label: "Corrupted", value: data.corrupted, color: "#C62828" },
          ].map((d, i) => (
            <div key={i} style={{
              background: "white",
              padding: 20,
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              textAlign: "center"
            }}>
              <h4 style={{ color: d.color, fontSize: 26, margin: 0 }}>{d.value}</h4>
              <p style={{ marginTop: 6, color: "#555", fontSize: 14 }}>{d.label}</p>
            </div>
          ))}
        </div>
      )}


      {/* =============== MAIN GRID (LEFT≈Chart, Right≈Stats) =============== */}
      {data && (
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 25,
          padding: "0 20px 60px"
        }}>

          {/* -------- Bar Chart -------- */}
          <div style={{
            background: "white",
            padding: 26,
            borderRadius: 14,
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{ marginBottom: 12 }}> Salary Distribution (Top 10)</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={data.top10.map((v:number,i:number)=>({name:`${i+1}`,salary:v}))}>
                  <XAxis dataKey="name" />
                  <Tooltip />
                  <Bar dataKey="salary" fill="#002D72" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>


          {/* -------- Salary Context Card -------- */}
          <div style={{
            background: "white",
            padding: 26,
            borderRadius: 14,
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)"
          }}>
            <h3> Salary Context</h3>

            <ul style={{ marginTop: 12, lineHeight: "28px", fontSize: 15 }}>
              <li> Median (Top 125): ${data.median_salaries.toLocaleString()}</li>
              <li> Lowest (Top 125): ${data.min_salaries.toLocaleString()}</li>
              <li> Highest (Top 125): ${data.max_salaries.toLocaleString()}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
