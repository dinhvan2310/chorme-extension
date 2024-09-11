import { useOutlet } from "react-router-dom";

function PopupLayout() {
    const outlet = useOutlet();
    return (
        <div
            style={{
                width: 384,
                height: 480,
                overflowY: "auto",
                overflowX: "hidden",
                backgroundColor: "#f9fafb",
                scrollBehavior: "smooth",
                scrollbarWidth: "thin",
                scrollbarColor: "#333 #f9fafb",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            {outlet}
        </div>
    );
}

export default PopupLayout;
