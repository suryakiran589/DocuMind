export default function DashboardPage() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "12px",
      color: "#9ca3af",
    }}>
      <p style={{ fontSize: "18px" }}>No PDF selected</p>
      <p style={{ fontSize: "14px" }}>Upload a PDF or select a chat from the sidebar</p>
    </div>
  );
}