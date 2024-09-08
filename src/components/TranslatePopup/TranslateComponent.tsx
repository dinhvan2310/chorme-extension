import { Notepad, Setting2, Star1, VolumeHigh } from "iconsax-react";
import React, { useEffect } from "react";
import { WordEntry } from "../../types/WordDefinitionFreeType";
import TouchableOpacity from "../TouchableOpacity/TouchableOpacity";
import UseAnimations from "react-useanimations";
// EVERY ANIMATION NEEDS TO BE IMPORTED FIRST -> YOUR BUNDLE WILL INCLUDE ONLY WHAT IT NEEDS
import loading2 from "react-useanimations/lib/loading2";
import settings2 from "react-useanimations/lib/settings2";
import star from "react-useanimations/lib/star";
import { getWordDefinition } from "../../content/apis/dictionaryFree";

interface TranslatePopupProps {
    textSelection: string;
}

function TranslatePopup(props: TranslatePopupProps) {
    const { textSelection } = props;

    const [wordDefinition, setWordDefinition] = React.useState<WordEntry[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const data = await getWordDefinition(textSelection);
            setWordDefinition(data ?? []);
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
                }}
            >
                No definition found
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
                maxWidth: "360px",
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
                            const audio = new Audio(
                                wordDefinition
                                    .find((w: { phonetics: any[] }) =>
                                        w.phonetics.find(
                                            (p: { audio: any }) => p.audio
                                        )
                                    )
                                    ?.phonetics.find(
                                        (p: { audio: any }) => p.audio
                                    )?.audio || ""
                            );
                            audio.play();
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
                    <div
                        style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            opacity: 0.8,
                            color: "#fff",
                            marginLeft: "12px",
                        }}
                    >
                        /{wordDefinition[0].phonetic ?? ""}/
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
                {wordDefinition?.map((word, index) => {
                    return (
                        <div key={index}>
                            {word.meanings.map((meaning, index) => {
                                return (
                                    <div key={index}>
                                        <div
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: "600",
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                opacity: 0.8,
                                                marginTop:
                                                    index === 0 ? "0" : "8px",
                                            }}
                                        >
                                            <Notepad
                                                size="14"
                                                style={{
                                                    marginRight: "8px",
                                                }}
                                            />
                                            {meaning.partOfSpeech}
                                        </div>
                                        {meaning.definitions.map(
                                            (definition, index) => {
                                                if (index > 0) return null;
                                                return (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            fontSize: "14px",
                                                            marginBottom: "4px",
                                                            fontWeight: "500",
                                                            marginTop: "4px",
                                                        }}
                                                    >
                                                        {definition.definition}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TranslatePopup;
