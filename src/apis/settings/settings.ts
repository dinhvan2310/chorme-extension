
// export const getSettings = async () => {    
//     const settings: SettingsType = {
//         langFrom: (await chrome.storage.local.get("langFrom")).langFrom || "en",
//         langTo: (await chrome.storage.local.get("langTo")).langTo || "vi",
//         wordSetSave: (await chrome.storage.local.get("wordSetSave")).wordSetSave || 'EXTENSION',
//         isAutoReminder: (await chrome.storage.local.get("isAutoReminder")).isAutoReminder || false,
//         reminderInterval: (await chrome.storage.local.get("reminderInterval")).reminderInterval || 5,
//         isHighlight: (await chrome.storage.local.get("isHighlight")).isHighlight || true,
//     }
//     return settings;
// }

export type langFromType = "detect" | "en" | "vi" | "ja" | "zh" | "ko" | "fr";
export type langToType = "en" | "vi" | "ja" | "zh" | "ko" | "fr";
export type voiceAccentType = "en-US" | "en-GB" | "en-AU" | "vi-VN" | "ja-JP" | "zh-CN" | "ko-KR" | "fr-FR";
export interface SettingsType {
    langFrom: langFromType;
    langTo: langToType;
    voiceAccent: voiceAccentType;
    wordSetSave: string;
    isAutoReminder: boolean;
    reminderInterval: number;
    isHighlight: boolean;

    setLangFrom?: (lang: langFromType) => void;
    setLangTo?: (lang: langToType) => void;
    setVoiceAccent?: (accent: voiceAccentType) => void;
    setWordSetSave?: (wordSet: string) => void;
    setIsAutoReminder?: (isAuto: boolean) => void;
    setReminderInterval?: (interval: number) => void;
    setIsHighlight?: (isHighlight: boolean) => void;
}

const _getSettings = async (userId: string | undefined) => {
    let uid: string;
    if (userId !== undefined) {
        uid = userId;
    } else {
        uid = "default";
    }

    const settings = await chrome.storage.local.get(uid);
    if (settings[uid]) {
        return settings[uid];
    } else {
        await chrome.storage.local.set({
            [uid]: {
                langFrom: "detect",
                langTo: "vi",
                voiceAccent: 'en-US',
                wordSetSave: uid === 'default' ? '' : uid,
                isAutoReminder: true,
                reminderInterval: 5,
                isHighlight: true
            }
        })
        return {
            langFrom: "detect",
            langTo: "vi",
            voiceAccent: 'en-US',
            wordSetSave: uid === 'default' ? '' : uid,
            isAutoReminder: true,
            reminderInterval: 5,
            isHighlight: true
        }
    }

}

export const getSettings = async (): Promise<SettingsType> => {
    const userId = await chrome.storage.local.get("userId");
    const settings = await _getSettings(userId?.userId);
    return settings;
}

export const setSettings = async (settings: SettingsType) => {
    let uid: string;
    const userId = await chrome.storage.local.get("userId");
    if (!userId.userId) uid = "default";
    else uid = userId.userId;

    await chrome.storage.local.set({
        [uid]: settings
    })
}