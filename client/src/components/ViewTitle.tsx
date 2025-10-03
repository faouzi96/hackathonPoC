const ViewTitle = ({
  title,
  metadata,
}: {
  title: string;
  metadata: { projectType: string; framework: string };
}) => {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          borderRadius: 5,
          width: "fit-content",
          padding: "5px 10px",
          zIndex: 10,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "white",
        }}
      >
        {title}
      </div>
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 10,
          borderRadius: 5,
          width: "fit-content",
          padding: "5px 10px",
          zIndex: 10,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "white",
        }}
      >
        {metadata?.projectType} - {metadata?.framework}
      </div>
    </>
  );
};

export default ViewTitle;
