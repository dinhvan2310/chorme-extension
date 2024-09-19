import { ArrowLeft2, VolumeHigh } from "iconsax-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";

import React from "react";
import useDebounce from "../../hooks/useDebounce";
import { WordType } from "../../types/WordType";
import { AuthContext } from "../../context/AuthProvider";
import {
    convertToWordType,
    getWordDefinition,
} from "../../content/apis/dictionaryFree";
import { translateText } from "../../content/apis/bingTranslateApi/bingTranslate";
import TouchableOpacity from "../../components/TouchableOpacity/TouchableOpacity";

function PopupTranslate() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const searchDebounce = useDebounce(search, 500);

    const [wordTranslation, setWordTranslation] = React.useState<string>("");
    const [wordDefinition, setWordDefinition] = React.useState<WordType[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const context = useContext(AuthContext);

    const { user, signOut } = context;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const data = await await convertToWordType(
                (await getWordDefinition(searchDebounce)) ?? [],
                5,
                6
            );
            const translatedText = await translateText(
                searchDebounce,
                ["vi"],
                "en"
            );
            setWordTranslation(translatedText);
            setWordDefinition(data);
            setIsLoading(false);
        };
        fetchData();
    }, [searchDebounce]);

    return (
        <div
            style={{
                width: "460px",
                backgroundColor: "#f9fafb",
                height: "100%",
            }}
        >
            <header
                style={{
                    backgroundColor: "#fff",
                    height: 57,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: "0 16px",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #f1f2f6",
                }}
            >
                <div
                    style={{
                        display: "flex",
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            navigate("/");
                        }}
                    >
                        <ArrowLeft2 size={20} color="#333" />
                    </TouchableOpacity>
                    <span
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: "#000",
                            marginLeft: 16,
                        }}
                    >
                        Translate
                    </span>
                </div>

                <div
                    style={{
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        cursor: "pointer",
                        overflow: "hidden",
                    }}
                >
                    <img
                        style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                        }}
                        src={user?.photoURL ?? ""}
                        alt="translate"
                    />
                </div>
            </header>

            <div
                style={{
                    padding: 16,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <div
                        style={{
                            padding: "16px 16px",
                            borderRadius: 8,
                            border: "1px solid #f1f2f6",
                            backgroundColor: "#fff",
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                width: "fit-content",
                                height: "fit-content",
                                cursor: "pointer",
                                marginBottom: 8,
                            }}
                            onPress={() => {
                                const synth = window.speechSynthesis;
                                const utterThis = new SpeechSynthesisUtterance(
                                    search
                                );
                                synth.speak(utterThis);
                            }}
                        >
                            <VolumeHigh size={16} color="#333" />
                        </TouchableOpacity>
                        <TextareaAutosize
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                            placeholder={"Type something to translate..."}
                            style={{
                                width: "100%",
                                resize: "none",
                                whiteSpace: "pre-line",
                                fontWeight: 600,
                                border: "none",
                                fontSize: 14,
                                backgroundColor: "transparent",
                                outline: "none",
                                color: "#333",
                            }}
                        />
                    </div>
                    <div style={{ marginTop: "16px" }}>
                        <div
                            style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#333",
                            }}
                        >
                            Translation:
                        </div>
                    </div>
                    <div
                        style={{
                            overflowY: "auto",
                            scrollbarWidth: "thin",
                            scrollbarColor: "#fff #3a3b3c",
                            padding: "16px",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            textAlign: "left",
                            color: "#333",
                            backgroundColor: "#fff",
                            borderRadius: 8,
                            border: "1px solid #f1f2f6",
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    whiteSpace: "pre-line",
                                }}
                            >
                                {wordTranslation}
                            </div>
                        </div>
                        <div
                            style={{
                                marginTop: "8px",
                                width: "100%",
                            }}
                        ></div>
                    </div>
                    <div style={{ marginTop: "16px" }}>
                        <div
                            style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#333",
                            }}
                        >
                            Meaning:
                        </div>
                    </div>
                    <div
                        style={{
                            overflowY: "auto",
                            scrollbarWidth: "thin",
                            scrollbarColor: "#fff #3a3b3c",
                            padding: "16px",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            textAlign: "left",
                            color: "#333",
                            backgroundColor: "#fff",
                            borderRadius: 8,
                            border: "1px solid #f1f2f6",
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    whiteSpace: "pre-line",
                                }}
                            >
                                {wordDefinition.length > 0 &&
                                    wordDefinition[0].meaning}
                            </div>
                        </div>
                        <div
                            style={{
                                marginTop: "8px",
                                width: "100%",
                            }}
                        ></div>
                    </div>
                    <div style={{ marginTop: "16px" }}>
                        <div
                            style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#333",
                            }}
                        >
                            Examples:
                        </div>
                    </div>
                    <div
                        style={{
                            overflowY: "auto",
                            scrollbarWidth: "thin",
                            scrollbarColor: "#fff #3a3b3c",
                            padding: "16px",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            textAlign: "left",
                            color: "#333",
                            backgroundColor: "#fff",
                            borderRadius: 8,
                            border: "1px solid #f1f2f6",
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    whiteSpace: "pre-line",
                                }}
                            >
                                {wordDefinition.length > 0 && (
                                    <div>
                                        {wordDefinition[0].contexts.map(
                                            (context, index) => (
                                                <div key={index}>
                                                    {index + 1}. {context}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div
                            style={{
                                marginTop: "8px",
                                width: "100%",
                            }}
                        ></div>
                    </div>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 40,
                    fontSize: 12,
                    color: "#333",
                    marginBottom: 8,
                }}
            >
                Created by Nezuko
            </div>
        </div>
    );
}

export default PopupTranslate;
