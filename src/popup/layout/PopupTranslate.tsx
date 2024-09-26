import {
    ArrowLeft2,
    Notepad2,
    People,
    Translate,
    VolumeHigh,
} from "iconsax-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";

import { Tabs, Tooltip } from "antd";
import React from "react";
import { translateText } from "../../apis/bingTranslateApi/bingTranslate";
import TouchableOpacity from "../../components/TouchableOpacity/TouchableOpacity";
import { AuthContext } from "../../context/AuthProvider";
import { SettingsContext } from "../../context/SettingsContext";
import { suggestContext, suggestDefinition } from "../../firebase/suggestAPI";
import useDebounce from "../../hooks/useDebounce";

function PopupTranslate() {
    const navigate = useNavigate();
    const settingsData = useContext(SettingsContext);

    const [search, setSearch] = useState("");
    const searchDebounce = useDebounce(search, 500);

    const [isLoading, setIsLoading] = React.useState(false);
    const context = useContext(AuthContext);

    const [wordDefinitionByDictionary, setWordDefinitionByDictionary] =
        React.useState<string[]>([]);
    const [wordDefinitionByCommunity, setWordDefinitionByCommunity] =
        React.useState<string[]>([]);
    const [wordDefinitionByBingTranslate, setWordDefinitionByBingTranslate] =
        React.useState<string>();
    const [wordContexts, setWordContexts] = React.useState<string[]>([]);

    const { user, signOut } = context;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const dictionary = await suggestDefinition(
                searchDebounce,
                "",
                "dictionary"
            );
            const translatedText = await translateText(
                searchDebounce,
                [settingsData?.langTo ?? "vi"],
                settingsData?.langFrom ?? "en"
            );
            const community = await suggestDefinition(
                searchDebounce,
                "",
                "community"
            );
            const wordContexts = await suggestContext(
                searchDebounce,
                "",
                [""],
                -1
            );
            setWordDefinitionByDictionary(dictionary);
            setWordDefinitionByBingTranslate(translatedText);
            setWordDefinitionByCommunity(community);
            setWordContexts(wordContexts);
            setIsLoading(false);
        };
        fetchData();
    }, [searchDebounce]);

    const items = [
        {
            label: "Bing Translate",
            icon: (
                <Tooltip title="Bing Translate">
                    <Translate size={16} color="#000" />
                </Tooltip>
            ),
            key: "1",
            children: (
                <>
                    <div
                        style={{
                            fontSize: "14px",
                            color: "#000",
                            fontWeight: "500",
                            width: "100%",
                        }}
                    >
                        Meaning:
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
                        <div
                            style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#666",
                                whiteSpace: "pre-line",
                            }}
                        >
                            {wordDefinitionByBingTranslate}
                        </div>
                    </div>
                </>
            ),
        },
        {
            label: "From Community",
            icon: (
                <Tooltip title="Community">
                    <People size={16} color="#000" />
                </Tooltip>
            ),
            key: "2",
            children: (
                <>
                    <div
                        style={{
                            fontSize: "14px",
                            color: "#000",
                            fontWeight: "500",
                            width: "100%",
                        }}
                    >
                        Meaning:
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
                            {wordDefinitionByCommunity.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        color: "#666",
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ),
        },
        {
            label: "From Dictionary",
            key: "3",
            icon: (
                <Tooltip title="Dictionary">
                    <Notepad2 size={16} color="#000" />
                </Tooltip>
            ),
            children: (
                <>
                    <div
                        style={{
                            fontSize: "14px",
                            color: "#000",
                            fontWeight: "500",
                            width: "100%",
                        }}
                    >
                        Meaning:
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
                            {wordDefinitionByDictionary.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        color: "#666",
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ),
        },
    ];

    return (
        <div
            style={{
                width: "500px",
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

                {user ? (
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
                            src={user.photoURL}
                            alt={"user"}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            navigate("/signin");
                        }}
                        style={{
                            height: "36px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#107cff",
                            cursor: "pointer",
                            color: "#fff",
                        }}
                    >
                        Sign In
                    </button>
                )}
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
                    <Tabs
                        defaultActiveKey="1"
                        tabPosition={"top"}
                        items={items}
                        style={{
                            width: "100%",
                        }}
                    />
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
                                {wordContexts.length > 0 && (
                                    <div>
                                        {wordContexts.map((context, index) => (
                                            <div key={index}>
                                                {index + 1}. {context}
                                            </div>
                                        ))}
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
