import { createContext, useEffect, useState } from "react";
import {
    getSettings,
    langFromType,
    langToType,
    SettingsType,
} from "../apis/settings/settings";

export const SettingsContext = createContext<SettingsType | null>(null);

interface SettingsProviderProps {
    children: React.ReactNode;
}

const SettingsProvider = (props: SettingsProviderProps) => {
    const { children } = props;

    const [langFrom, setLangFrom] = useState<langFromType>("detect");
    const [langTo, setLangTo] = useState<langToType>("vi");

    const [wordSetSave, setWordSetSave] = useState<string>("");

    const [isAutoReminder, setIsAutoReminder] = useState<boolean>(false);
    const [reminderInterval, setReminderInterval] = useState<number>(5);

    const [isHighlight, setIsHighlight] = useState<boolean>(true);

    const fetchData = async () => {
        const settings = await getSettings();
        setLangFrom(settings.langFrom);
        setLangTo(settings.langTo);
        setWordSetSave(settings.wordSetSave);
        setIsAutoReminder(settings.isAutoReminder);
        setReminderInterval(settings.reminderInterval);
        setIsHighlight(settings.isHighlight);
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
            if (changes.isAutoReminder) {
                setIsAutoReminder(changes.isAutoReminder.newValue);
            }
            if (changes.reminderInterval) {
                setReminderInterval(changes.reminderInterval.newValue);
            }
            if (changes.isHighlight) {
                setIsHighlight(changes.isHighlight.newValue);
            }
        }
    });

    const value = {
        langFrom,
        langTo,
        wordSetSave,
        isAutoReminder,
        reminderInterval,
        isHighlight,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsProvider;
