import { createContext, useEffect, useState } from "react";
import {
    getSettings,
    langFromType,
    langToType,
    setSettings,
    SettingsType,
    voiceAccentType,
} from "../apis/settings/settings";

export const SettingsContext = createContext<SettingsType | null>(null);

interface SettingsProviderProps {
    children: React.ReactNode;
}

const SettingsProvider = (props: SettingsProviderProps) => {
    const { children } = props;

    const [langFrom, setLangFrom] = useState<langFromType>("detect");
    const [langTo, setLangTo] = useState<langToType>("vi");

    const [voiceAccent, setVoiceAccent] = useState<voiceAccentType>("en-US");

    const [wordSetSave, setWordSetSave] = useState<string>("");

    const [isAutoReminder, setIsAutoReminder] = useState<boolean>(false);
    const [reminderInterval, setReminderInterval] = useState<number>(5);

    const [isHighlight, setIsHighlight] = useState<boolean>(true);

    const fetchData = async () => {
        const settings = await getSettings();
        setLangFrom(settings.langFrom);
        setLangTo(settings.langTo);
        setVoiceAccent(settings.voiceAccent);
        setWordSetSave(settings.wordSetSave);
        setIsAutoReminder(settings.isAutoReminder);
        setReminderInterval(settings.reminderInterval);
        setIsHighlight(settings.isHighlight);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const value = {
        langFrom,
        langTo,
        voiceAccent,
        wordSetSave,
        isAutoReminder,
        reminderInterval,
        isHighlight,

        setLangFrom: (lang: langFromType) => {
            setSettings({
                langFrom: lang,
                langTo,
                voiceAccent,
                wordSetSave,
                isAutoReminder,
                reminderInterval,
                isHighlight,
            });
            setLangFrom(lang);
        },
        setLangTo: (lang: langToType) => {
            setSettings({
                langFrom,
                langTo: lang,
                voiceAccent,
                wordSetSave,
                isAutoReminder,
                reminderInterval,
                isHighlight,
            });
            setLangTo(lang);
        },
        setVoiceAccent: (accent: voiceAccentType) => {
            setSettings({
                langFrom,
                langTo,
                voiceAccent: accent,
                wordSetSave,
                isAutoReminder,
                reminderInterval,
                isHighlight,
            });
            setVoiceAccent(accent);
        },
        setWordSetSave: (wordSet: string) => {
            setSettings({
                langFrom,
                langTo,
                voiceAccent,
                wordSetSave: wordSet,
                isAutoReminder,
                reminderInterval,
                isHighlight,
            });
            setWordSetSave(wordSet);
        },
        setIsAutoReminder: (isAuto: boolean) => {
            setSettings({
                langFrom,
                langTo,
                voiceAccent,
                wordSetSave,
                isAutoReminder: isAuto,
                reminderInterval,
                isHighlight,
            });
            setIsAutoReminder(isAuto);
        },
        setReminderInterval: (interval: number) => {
            setSettings({
                langFrom,
                langTo,
                voiceAccent,
                wordSetSave,
                isAutoReminder,
                reminderInterval: interval,
                isHighlight,
            });
            setReminderInterval(interval);
        },
        setIsHighlight: (isHighlight: boolean) => {
            setSettings({
                langFrom,
                langTo,
                voiceAccent,
                wordSetSave,
                isAutoReminder,
                reminderInterval,
                isHighlight: isHighlight,
            });
            setIsHighlight(isHighlight);
        },
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsProvider;
