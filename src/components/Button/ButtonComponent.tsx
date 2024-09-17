import React from "react";

interface ButtonComponentProps {
    text: string;
    icon: React.ReactNode;
    iconPosition?: "left" | "top";

    onClick: () => void;
    style?: React.CSSProperties;
}
function ButtonComponent(props: ButtonComponentProps) {
    const { text, icon, onClick, style, iconPosition = "top" } = props;
    const [hover, setHover] = React.useState(false);
    const [active, setActive] = React.useState(false);

    if (iconPosition === "top")
        return (
            <div
                onMouseDown={() => setActive(true)}
                onMouseUp={() => setActive(false)}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => {
                    setHover(false);
                    setActive(false);
                }}
                style={{
                    display: "inline-flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "42px",
                    borderRadius: 8,
                    backgroundColor: hover
                        ? "#F8F8F8"
                        : active
                        ? "#e0e0e0"
                        : "#fff",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    ...style,
                }}
                onClick={onClick}
            >
                {icon}
                <span
                    style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#000",
                        marginTop: 8,
                    }}
                >
                    {text}
                </span>
            </div>
        );
    else
        return (
            <div
                onMouseDown={() => setActive(true)}
                onMouseUp={() => setActive(false)}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => {
                    setHover(false);
                    setActive(false);
                }}
                style={{
                    display: "inline-flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: "24px",
                    borderRadius: 8,
                    backgroundColor: hover
                        ? "#FCFCFC"
                        : active
                        ? "#e0e0e0"
                        : "#fff",
                    boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
                    ...style,
                }}
                onClick={onClick}
            >
                {icon}
                <span
                    style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#000",
                        marginLeft: 8,
                    }}
                >
                    {text}
                </span>
            </div>
        );
}

export default ButtonComponent;
