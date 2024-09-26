import { createContext, useEffect, useState } from "react";

export type langFromType = "detect" | "en" | "vi" | "ja" | "zh" | "ko" | "fr";
export type langToType = "en" | "vi" | "ja" | "zh" | "ko" | "fr";

export interface SettingsType {
    // Translate
    langFrom: langFromType;
    langTo: langToType;
    _setLangFrom?: (lang: langFromType) => void;
    _setLangTo?: (lang: langToType) => void;
    wordSetSave: string;
    _setWordSetSave?: (wordSetId: string) => void;

    // Highlight
    isHighlight: boolean;
    setIsHighlight?: (isHighlight: boolean) => void;

    allowHighlightAllWebsites: boolean;
    setAllowHighlightAllWebsites?: (allow: boolean) => void;
    accessListHighLightWordNotLearned: string[];
    addAccessListHighLightWordNotLearned?: (item: string) => void;
    removeAccessListHighLightWordNotLearned?: (item: string) => void;

    // Status
    numOfTimesLearnedToChangeStatus: number;
    setNumOfTimesLearnedToChangeStatus?: (num: number) => void;
}

export const SettingsContext = createContext<SettingsType | null>(null);

interface SettingsProviderProps {
    children: React.ReactNode;
}

export const _getLangFrom = async () => {
    const rs = await chrome.storage.local.get("langFrom");
    if (rs.langFrom) {
        return rs.langFrom;
    } else {
        chrome.storage.local.set({ langFrom: "detect" });
        return "detect";
    }
};
export const _setLangFrom = async (lang: langFromType) => {
    chrome.storage.local.set({ langFrom: lang });
};
export const _getLangTo = async () => {
    const rs = await chrome.storage.local.get("langTo");
    if (rs.langTo) {
        return rs.langTo;
    } else {
        chrome.storage.local.set({ langTo: "vi" });
        return "vi";
    }
};
export const _setLangTo = async (lang: langToType) => {
    chrome.storage.local.set({ langTo: lang });
};
export const _getWordSetSave = async () => {
    const rs = await chrome.storage.local.get("wordSetSave");
    if (rs.wordSetSave) {
        return rs.wordSetSave;
    } else {
        chrome.storage.local.set({ wordSetSave: "" });
        return "";
    }
};
export const _setWordSetSave = async (wordSetId: string) => {
    chrome.storage.local.set({ wordSetSave: wordSetId });
};

const SettingsProvider = (props: SettingsProviderProps) => {
    const { children } = props;

    const [langFrom, setLangFrom] = useState<
        "detect" | "en" | "vi" | "ja" | "zh" | "ko" | "fr"
    >("detect");
    const [langTo, setLangTo] = useState<
        "en" | "vi" | "ja" | "zh" | "ko" | "fr"
    >("vi");
    const [wordSetSave, setWordSetSave] = useState<string>("");

    const fetchData = async () => {
        const langFrom = (await _getLangFrom()) as langFromType;
        setLangFrom(langFrom);
        const langTo = (await _getLangTo()) as langToType;
        setLangTo(langTo);
        const wordSetSave = (await _getWordSetSave()) as string;
        setWordSetSave(wordSetSave);
    };

    useEffect(() => {
        fetchData();
    }, []);

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === "local") {
            if (changes.langFrom) {
                setLangFrom(changes.langFrom.newValue);
            }
            if (changes.langTo) {
                setLangTo(changes.langTo.newValue);
            }
            if (changes.wordSetSave) {
                setWordSetSave(changes.wordSetSave.newValue);
            }
        }
    });

    const [allowRemindAllWebsites, setAllowRemindAllWebsites] =
        useState<boolean>(true);
    const [accessListAlowedRemembers, setAccessListAlowedRemembers] = useState<
        string[]
    >(["https://www.google.com/", "https://www.facebook.com/"]);
    const addAccessListAlowedRemembers = (item: string) => {
        setAccessListAlowedRemembers([...accessListAlowedRemembers, item]);
    };
    const removeAccessListAlowedRemembers = (item: string) => {
        setAccessListAlowedRemembers(
            accessListAlowedRemembers.filter((i) => i !== item)
        );
    };

    const [isHighlight, setIsHighlight] = useState<boolean>(true);
    const [allowHighlightAllWebsites, setAllowHighlightAllWebsites] =
        useState<boolean>(true);
    const [
        accessListHighLightWordNotLearned,
        setAccessListHighLightWordNotLearned,
    ] = useState<string[]>([]);
    const addAccessListHighLightWordNotLearned = (item: string) => {
        setAccessListHighLightWordNotLearned([
            ...accessListHighLightWordNotLearned,
            item,
        ]);
    };
    const removeAccessListHighLightWordNotLearned = (item: string) => {
        setAccessListHighLightWordNotLearned(
            accessListHighLightWordNotLearned.filter((i) => i !== item)
        );
    };

    const [
        numOfTimesLearnedToChangeStatus,
        setNumOfTimesLearnedToChangeStatus,
    ] = useState<number>(2);

    const value = {
        langFrom,
        langTo,
        _setLangFrom,
        _setLangTo,
        wordSetSave,
        _setWordSetSave,

        allowRemindAllWebsites,
        setAllowRemindAllWebsites,
        accessListAlowedRemembers,
        addAccessListAlowedRemembers,
        removeAccessListAlowedRemembers,
        isHighlight,
        setIsHighlight,
        allowHighlightAllWebsites,
        setAllowHighlightAllWebsites,
        accessListHighLightWordNotLearned,
        addAccessListHighLightWordNotLearned,
        removeAccessListHighLightWordNotLearned,

        numOfTimesLearnedToChangeStatus,
        setNumOfTimesLearnedToChangeStatus,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsProvider;
