import React from "react";

interface TouchableOpacityProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: React.CSSProperties;
    disabled?: boolean;

    opacity?: number;
}
function TouchableOpacity(props: TouchableOpacityProps) {
    const { children, onPress, style, disabled, opacity = 0.8 } = props;

    const [hovered, setHovered] = React.useState(false);
    const [pressed, setPressed] = React.useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
                setHovered(false);
                setPressed(false);
            }}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onClick={onPress}
            style={{
                ...style,
                cursor: "pointer",
                opacity: disabled ? 0.5 : pressed ? 0.5 : hovered ? opacity : 1,
            }}
        >
            {children}
        </div>
    );
}

export default TouchableOpacity;
