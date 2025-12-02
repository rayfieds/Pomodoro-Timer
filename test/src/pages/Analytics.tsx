import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import { Link } from "react-router-dom";

interface AnalyticsData {
  totalPomodoros: number;
  byDay: Array<{
    date: string;
    count: number;
  }>;
}

export function Analytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await api.getAnalytics(user.id);
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="page">
        <div className="analytics-container">
          <h2>Analytics</h2>
          <p style={{ marginTop: "16px", opacity: 0.8 }}>
            <Link to="/login" style={{ color: "white", textDecoration: "underline" }}>
              Login or create an account
            </Link>{" "}
            to track your productivity stats over time.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page">
        <div className="analytics-container">
          <h2>Analytics</h2>
          <p>Loading your stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="analytics-container">
        <h2>Analytics</h2>
        {analytics && (
          <>
            <div style={{ marginTop: "20px" }}>
              <h3>Total Completed Pomodoros</h3>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
                {analytics.totalPomodoros}
              </p>
            </div>
            
            {analytics.byDay && analytics.byDay.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3>Last 7 Days</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {analytics.byDay.map((day) => (
                    <li key={day.date} style={{ marginBottom: "8px" }}>
                      {new Date(day.date).toLocaleDateString()}: {day.count} pomodoros
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}