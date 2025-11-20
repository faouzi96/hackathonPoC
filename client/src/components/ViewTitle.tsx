const ViewTitle = ({
  title,
  metadata,
}: {
  title: string;
  metadata: { projectType: string; framework: string };
}) => {
  return (
    <div
      style={{
        width: 280,
        height: "10%",
        padding: 12,
        borderRight: "1px solid #e5e7eb",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        position: "absolute",
        right: 20,
        top: "10px",
        zIndex: 10,
        borderRadius: "15px",
      }}
    >
      <div
        style={{
          width: "100%",
          zIndex: 10,
          borderBottom: "1px solid #00000020",
          padding: "5px 0",
        }}
      >
        Title: {title}
      </div>
      <div
        style={{
          width: "100%",
          padding: "5px 0",
          borderBottom: "1px solid #00000020",
          zIndex: 10,
          visibility:
            metadata.projectType !== "unknown" ||
            metadata.framework !== "unknown"
              ? "visible"
              : "hidden",
        }}
      >
        {metadata?.projectType} - {metadata?.framework}
      </div>
    </div>
  );
};

export default ViewTitle;
