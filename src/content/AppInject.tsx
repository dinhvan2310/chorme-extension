import React, { useEffect } from "react";
import WebFont from "webfontloader";
import RenderIf from "./components/RenderIf";
import TranslateComponent from "./components/TranslatePopup/TranslateComponent";

interface AppInjectProps {
    style?: React.CSSProperties;
}

const getSelectedText = () => {
    const rs = document.getSelection();
    return rs ? rs.toString().trim() : "";
};

const calcLeftPosition = (left: number) => {
    if (left + 360 > window.innerWidth) {
        return window.innerWidth - (360 + 24);
    } else {
        return left;
    }
};

function AppInject(props: AppInjectProps) {
    const { style } = props;

    const [showPopup, setShowPopup] = React.useState(false);
    const [showTranslation, setShowTranslation] = React.useState(false);

    const [left, setLeft] = React.useState(0);
    const [top, setTop] = React.useState(0);

    useEffect(() => {
        WebFont.load({
            google: {
                families: ["Poppins:400,500,600,700,800"],
            },
        });
        const handleDocumentMouseUp = (e: MouseEvent) => {
            if (
                getSelectedText().length > 0 &&
                showPopup === false &&
                showTranslation === false &&
                !document
                    .getElementById("popupRoot")
                    ?.contains(e.target as Node)
            ) {
                setLeft(calcLeftPosition(e.pageX));
                setTop(e.pageY);
                setShowPopup(true);
            } else if (
                !document
                    .getElementById("popupRoot")
                    ?.contains(e.target as Node) &&
                !document
                    .getElementById("treeSelection")
                    ?.contains(e.target as Node)
            ) {
                setShowPopup(false);
                setShowTranslation(false);
            }
        };

        const handleDocumentDbClick = (e: MouseEvent) => {
            if (
                getSelectedText().length > 0 &&
                showPopup === false &&
                showTranslation === false &&
                !document
                    .getElementById("popupRoot")
                    ?.contains(e.target as Node)
            ) {
                setLeft(calcLeftPosition(e.pageX));
                setTop(e.pageY);
                setShowPopup(true);
                setShowTranslation(true);
            } else if (
                !document
                    .getElementById("popupRoot")
                    ?.contains(e.target as Node) &&
                !document
                    .getElementById("treeSelection")
                    ?.contains(e.target as Node)
            ) {
                setShowPopup(false);
                setShowTranslation(false);
            }
        };

        document.removeEventListener("mouseup", handleDocumentMouseUp);
        document.removeEventListener("dblclick", handleDocumentDbClick);

        document.addEventListener("mouseup", handleDocumentMouseUp);
        document.addEventListener("dblclick", handleDocumentDbClick);
    }, []);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                top: 0,
                left: 0,
                alignItems: "center",
                position: "absolute",
                transform: `translate(${left}px, ${top}px)`,
                ...style,
            }}
        >
            <RenderIf condition={showPopup && showTranslation === false}>
                <div
                    style={{
                        objectFit: "contain",
                        height: "20px",
                        width: "20px",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        setShowTranslation(true);

                        document.addEventListener("click", (e) => {
                            if (
                                !document
                                    .getElementById("popupRoot")
                                    ?.contains(e.target as Node) &&
                                showTranslation === true
                            ) {
                                setShowTranslation(false);
                            }
                        });
                    }}
                >
                    <img
                        src={`chrome-extension://${chrome.runtime.id}/icon.png`}
                        alt="icon"
                        style={{
                            height: "24px",
                            width: "24px",
                        }}
                    />
                </div>
            </RenderIf>
            <RenderIf condition={showTranslation}>
                <TranslateComponent textSelection={getSelectedText()} />
            </RenderIf>
        </div>
    );
}

export default AppInject;
