import { SettingsType } from "../../context/SettingsContext"

export const getSettings = async () => {    
    const settings: SettingsType = {
        langFrom: (await chrome.storage.local.get("langFrom")).langFrom || "en",
        langTo: (await chrome.storage.local.get("langTo")).langTo || "vi",
        wordSetSave: (await chrome.storage.local.get("wordSetSave")).wordSetSave || '',


        accessListHighLightWordNotLearned: (await chrome.storage.local.get("accessListHighLightWordNotLearned")).accessListHighLightWordNotLearned || [],
        allowHighlightAllWebsites: (await chrome.storage.local.get("allowHighlightAllWebsites")).allowHighlightAllWebsites || false,
        isHighlight: (await chrome.storage.local.get("isHighlight")).isHighlight || true,
        numOfTimesLearnedToChangeStatus: (await chrome.storage.local.get("numOfTimesLearnedToChangeStatus")).numOfTimesLearnedToChangeStatus || 3,
    }
    return settings;
}