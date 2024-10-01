import { Notepad2, People, Translate, VolumeHigh } from "iconsax-react";
import React, { useEffect, useState } from "react";
import UseAnimations from "react-useanimations";
import TouchableOpacity from "../../../components/TouchableOpacity/TouchableOpacity";
// EVERY ANIMATION NEEDS TO BE IMPORTED FIRST -> YOUR BUNDLE WILL INCLUDE ONLY WHAT IT NEEDS
import loading2 from "react-useanimations/lib/loading2";
import settings2 from "react-useanimations/lib/settings2";
import star from "react-useanimations/lib/star";

import { Tabs, Tooltip, Typography } from "antd";
import { translateText } from "../../../apis/bingTranslateApi/bingTranslate";
import { getSettings, SettingsType } from "../../../apis/settings/settings";
import { suggestDefinition } from "../../../firebase/suggestAPI";
import {
    addWord,
    checkCurrentUserIsHaveWord,
    removeWord,
} from "../../../firebase/wordAPI";
import { getWordSet } from "../../../firebase/wordSetAPI";
import { WordType } from "../../../types/WordType";

interface TranslatePopupProps {
    textSelection: string;
}

function TranslatePopup(props: TranslatePopupProps) {
    const { textSelection } = props;
    const [wordSetSave, setWordSetSave] = useState<{
        wordSetId: string;
        wordSetName: string;
    }>();
    const [userId, setUserId] = useState<string>();

    const [saveWord, setSaveWord] = useState(false);
    const [settingsData, setSettingsData] = useState<SettingsType>();

    const [activeTab, setActiveTab] = React.useState("1");
    const [wordDefinitionByDictionary, setWordDefinitionByDictionary] =
        React.useState<string[]>([]);
    const [wordDefinitionByCommunity, setWordDefinitionByCommunity] =
        React.useState<string[]>([]);
    const [wordDefinitionByBingTranslate, setWordDefinitionByBingTranslate] =
        React.useState<string>();

    const [isLoading, setIsLoading] = React.useState(false);

    const [infoText, setInfoText] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            const data = await chrome.storage.local.get("userId");
            if (!data.userId) setUserId("");
            else {
                setUserId(data.userId);
            }

            const settings = await getSettings();
            console.log("settings", settings);
            setSettingsData(settings);
            if (settings.wordSetSave === "") {
                setWordSetSave({
                    wordSetId: "",
                    wordSetName: "",
                });
            } else {
                setWordSetSave({
                    wordSetId: settings.wordSetSave,
                    wordSetName:
                        (await getWordSet(settings.wordSetSave))?.name ?? "",
                });
            }
            const checkCurrentUserHaveWord = await checkCurrentUserIsHaveWord(
                `${textSelection.trim().toLowerCase()}`,
                undefined
            );
            if (checkCurrentUserHaveWord.length === 0) {
                setInfoText("");
            } else {
                let error = "This word is already in: ";
                checkCurrentUserHaveWord.forEach((item, index) => {
                    error += `(${item.folderName} - ${item.wordSetName})`;
                    if (checkCurrentUserHaveWord.length > 1) {
                        if (index !== checkCurrentUserHaveWord.length - 1) {
                            error += ", ";
                        }
                    }
                });
                setInfoText(error);
            }

            const dictionary = await suggestDefinition(
                textSelection,
                "",
                "dictionary"
            );
            const translatedText = await translateText(
                textSelection,
                [settings?.langTo ?? "vi"],
                settings?.langFrom ?? "en"
            );
            const community = await suggestDefinition(
                textSelection,
                "",
                "community"
            );
            setWordDefinitionByDictionary(dictionary);
            setWordDefinitionByBingTranslate(translatedText);
            setWordDefinitionByCommunity(community);
            setIsLoading(false);
        };
        fetchData();
    }, [textSelection]);

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
                    backgroundColor: "#FFF",
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

    const items = [
        {
            label: "",
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
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#666",
                            whiteSpace: "pre-line",
                        }}
                    >
                        {wordDefinitionByBingTranslate}
                    </div>
                </>
            ),
        },
        {
            label: "",
            icon: (
                <Tooltip title="Community">
                    <People size={16} color="#000" />
                </Tooltip>
            ),
            key: "2",
            disabled: wordDefinitionByCommunity.length === 0,
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
                </>
            ),
        },
        {
            label: "",
            key: "3",
            icon: (
                <Tooltip title="Dictionary">
                    <Notepad2 size={16} color="#000" />
                </Tooltip>
            ),
            disabled: wordDefinitionByDictionary.length === 0,
            children: wordDefinitionByDictionary.length > 0 && (
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
                </>
            ),
        },
    ];

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                color: "#000",
                alignItems: "flex-start",
                backgroundColor: "#FFF",

                maxHeight: "240px",
                fontFamily: "Poppins, sans-serif",
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
                            display: "flex",
                            alignItems: "center",
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
                            color: "#000",
                        }}
                    >
                        {textSelection.slice(0, 36) +
                            (textSelection.length > 36 ? "..." : "")}
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Tooltip title="Save to word set">
                        <Typography.Text type="secondary">
                            {wordSetSave?.wordSetName}
                        </Typography.Text>
                    </Tooltip>
                    {userId && wordSetSave?.wordSetName !== "" && (
                        <TouchableOpacity
                            style={{
                                padding: "8px",
                                borderRadius: "8px",
                            }}
                            onPress={async () => {
                                if (!saveWord) {
                                    let word: WordType;
                                    switch (activeTab) {
                                        case "1":
                                            word = {
                                                name: textSelection,
                                                meaning:
                                                    wordDefinitionByBingTranslate ??
                                                    "",
                                                contexts: [],
                                                imageURL: "",
                                            };
                                            break;
                                        case "2":
                                            word = {
                                                name: textSelection,
                                                meaning:
                                                    wordDefinitionByCommunity[0] ??
                                                    "",
                                                contexts: [],
                                                imageURL: "",
                                            };
                                            break;
                                        case "3":
                                            word = {
                                                name: textSelection,
                                                meaning:
                                                    wordDefinitionByDictionary[0] ??
                                                    "",
                                                contexts: [],
                                                imageURL: "",
                                            };
                                            break;
                                        default:
                                            word = {
                                                name: textSelection,
                                                meaning:
                                                    wordDefinitionByBingTranslate ??
                                                    "",
                                                contexts: [],
                                            };
                                            break;
                                    }
                                    if (!settingsData?.wordSetSave) return null;
                                    await addWord(
                                        settingsData?.wordSetSave,
                                        word
                                    );
                                } else {
                                    if (!settingsData?.wordSetSave) return null;
                                    await removeWord(
                                        `${settingsData?.wordSetSave}_${textSelection}`
                                    );
                                }
                                setSaveWord(!saveWord);
                            }}
                        >
                            <UseAnimations
                                animation={star}
                                size={24}
                                strokeColor="#000"
                                style={{ margin: "auto" }}
                            />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={{
                            padding: "8px",
                            borderRadius: "8px",
                        }}
                    >
                        <UseAnimations
                            animation={settings2}
                            size={24}
                            strokeColor="#000"
                            style={{ margin: "auto" }}
                        />
                    </TouchableOpacity>
                </div>
            </div>
            {infoText !== "" && (
                <Typography.Text type="warning">{infoText}</Typography.Text>
            )}
            <div
                style={{
                    width: "100%",
                    height: "1px",
                    backgroundColor: "#666666",
                    margin: "0 4px",
                    opacity: 0.4,
                }}
            ></div>

            <div
                style={{
                    overflowY: "auto",
                    maxHeight: "330px",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#666666 #F9f9f9",
                    paddingLeft: "8px",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    textAlign: "left",
                    width: "100%",
                }}
            >
                <Tabs
                    onChange={(key) => setActiveTab(key)}
                    defaultActiveKey={activeTab}
                    tabPosition={"right"}
                    items={items}
                    style={{
                        minWidth: 320,
                        maxWidth: 500,
                        width: "100%",
                    }}
                />
            </div>
        </div>
    );
}

export default TranslatePopup;
