import icon from "../assets/flow.svg";

export default function FlowList() {
  return (
    <aside
      style={{
        width: 280,
        height: "100vh",
        backgroundColor: "#fff",
        padding: 12,
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        position: "fixed",
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: "20px",
          color: "#000000e0",
          textTransform: "uppercase",
          borderBottom: "1px solid #00000020",
          paddingBottom: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <img
          src={icon}
          alt="Flow Icon"
          style={{
            height: 35,
          }}
        />
        <p>Flow Analyzer</p>
      </div>

      <input
        style={{
          padding: "8px 10px",
          border: "1px solid #d1d5db",
          borderRadius: 8,
          outline: "none",
        }}
        placeholder="Filter Flows..."
      />

      <button
        style={{
          padding: "6px 8px",
          borderRadius: 8,
          border: "1px solid #d1d5db",
          background: true ? "white" : "#f3f4f6",
          cursor: "pointer",
          fontWeight: 400,
        }}
        title="Show the whole list"
      >
        Show all
      </button>

      <div
        style={{
          overflowY: "auto",

          borderTop: "1px solid #f3f4f6",
          marginTop: 6,
          bottom: 0,
          flex: 1,
        }}
      ></div>
    </aside>
  );
}
