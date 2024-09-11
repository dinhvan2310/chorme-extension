import { Translate, VolumeHigh } from "iconsax-react";
import React, { useEffect } from "react";
import UseAnimations from "react-useanimations";
import TouchableOpacity from "../TouchableOpacity/TouchableOpacity";
// EVERY ANIMATION NEEDS TO BE IMPORTED FIRST -> YOUR BUNDLE WILL INCLUDE ONLY WHAT IT NEEDS
import loading2 from "react-useanimations/lib/loading2";
import settings2 from "react-useanimations/lib/settings2";
import star from "react-useanimations/lib/star";

import { WordType } from "../../types/WordType";
import {
    convertToWordType,
    getWordDefinition,
} from "../../content/apis/dictionaryFree";
import { translateText } from "../../content/apis/bingTranslateApi/bingTranslate";

interface TranslatePopupProps {
    textSelection: string;
}

function TranslatePopup(props: TranslatePopupProps) {
    const { textSelection } = props;

    const [wordTranslation, setWordTranslation] = React.useState<string>("");
    const [wordDefinition, setWordDefinition] = React.useState<WordType[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const data = await await convertToWordType(
                (await getWordDefinition(textSelection)) ?? [],
                5,
                6
            );
            const translatedText = await translateText(
                textSelection,
                ["vi"],
                "en"
            );
            setWordTranslation(translatedText);
            setWordDefinition(data);
            setIsLoading(false);
        };
        fetchData();
    }, [textSelection]);

    console.log(wordDefinition);

    if (isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "8px",
                    alignItems: "flex-start",
                    padding: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: "transparent",
                }}
            >
                <UseAnimations
                    animation={loading2}
                    size={24}
                    strokeColor="#fff"
                    style={{ margin: "auto" }}
                />
            </div>
        );
    }

    if (wordDefinition.length === 0) {
        console.log("wordDefinition");
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "8px",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    color: "#fff",
                    alignItems: "flex-start",
                    backgroundColor: "#3a3b3c",
                    padding: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    maxWidth: "620px",
                }}
            >
                {wordTranslation}
            </div>
        );
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                color: "#fff",
                alignItems: "flex-start",
                backgroundColor: "#3a3b3c",

                maxHeight: "240px",
                maxWidth: "620px",
                minWidth: "240px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <TouchableOpacity
                        style={{
                            padding: "8px",
                            borderRadius: "8px",
                            marginRight: "8px",
                        }}
                        onPress={() => {
                            const synth = window.speechSynthesis;
                            const utterThis = new SpeechSynthesisUtterance(
                                textSelection
                            );
                            synth.speak(utterThis);
                        }}
                    >
                        <VolumeHigh size="20" style={{}} />
                    </TouchableOpacity>

                    <div
                        style={{
                            fontSize: "16px",
                            fontWeight: "500",
                        }}
                    >
                        {textSelection}
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    <TouchableOpacity
                        style={{
                            padding: "8px",
                            borderRadius: "8px",
                        }}
                    >
                        <UseAnimations
                            animation={star}
                            size={24}
                            strokeColor="#fff"
                            style={{ margin: "auto" }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            padding: "8px",
                            borderRadius: "8px",
                        }}
                    >
                        <UseAnimations
                            animation={settings2}
                            size={24}
                            strokeColor="#fff"
                            style={{ margin: "auto" }}
                        />
                    </TouchableOpacity>
                </div>
            </div>

            <div
                style={{
                    width: "100%",
                    height: "1px",
                    backgroundColor: "#fff",
                    margin: "0 4px",
                    opacity: 0.4,
                }}
            ></div>

            <div
                style={{
                    overflowY: "auto",
                    maxHeight: "330px",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#fff #3a3b3c",
                    padding: "8px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    textAlign: "left",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        marginTop: "8px",
                        marginBottom: "14px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                        }}
                    >
                        <Translate size="16" style={{ marginRight: "16px" }} />
                        {wordTranslation}
                    </div>
                </div>
                <div
                    style={{
                        opacity: 0.6,
                        fontSize: "14px",
                    }}
                >
                    Meaning:
                </div>
                <div>
                    <div
                        style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#fff",
                            whiteSpace: "pre-line",
                        }}
                    >
                        {wordDefinition[0].meaning}
                    </div>
                </div>
                <div
                    style={{
                        marginTop: "8px",
                        width: "100%",
                    }}
                >
                    <div
                        style={{
                            opacity: 0.6,
                            fontSize: "14px",
                        }}
                    >
                        Example:{" "}
                    </div>
                    <div
                        style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#fff",
                            whiteSpace: "pre-line",
                        }}
                    >
                        {wordDefinition[0].contexts.join("\n")}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TranslatePopup;
