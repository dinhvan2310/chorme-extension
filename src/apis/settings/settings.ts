
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
export interface SettingsType {
    langFrom: langFromType;
    langTo: langToType;
    wordSetSave: string;
    isAutoReminder: boolean;
    reminderInterval: number;
    isHighlight: boolean;
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
                wordSetSave: uid === 'default' ? '' : uid,
                isAutoReminder: true,
                reminderInterval: 5,
                isHighlight: true
            }
        })
        return {
            langFrom: "detect",
            langTo: "vi",
            wordSetSave: uid === 'default' ? '' : uid,
            isAutoReminder: true,
            reminderInterval: 5,
            isHighlight: true
        }
    }

}

export const getSettings = async (): Promise<SettingsType> => {
    const userId = await chrome.storage.local.get("userId");
    console.log("userId", userId);
    console.log("userId.userId", userId?.userId);
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
    console.log(uid, settings);
}