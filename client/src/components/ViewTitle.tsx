const ViewTitle = ({ title }: { title: string }) => {
  return (
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
  );
};

export default ViewTitle;
