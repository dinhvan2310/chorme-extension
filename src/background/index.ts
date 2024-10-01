// background.js

import { getSettings } from "../apis/settings/settings";
import { getWordFromUser, getWordNotLearned } from "../firebase/wordAPI";
import { WordType } from "../types/WordType";

let wordNotLearned: WordType[] = [];

chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({
        url: "https://vocabulary-notebook-989d7.web.app/landingPageExtension/step1"
    })
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // const uid = await chrome.storage.local.get('userId')
    if (changeInfo.url) {
        const extensionOrigin = "https://vocabulary-notebook-989d7.web.app";
        const extensionOrigin2 = "http://localhost:5173";

        console.log(changeInfo.url, extensionOrigin);
        if (
            changeInfo.url === extensionOrigin ||
            changeInfo.url === `${extensionOrigin}/` ||
            changeInfo.url === extensionOrigin2 ||
            changeInfo.url === `${extensionOrigin2}/`
        ) {
            console.log("changeInfo.url === extensionOrigin");
            console.log("tabId", tabId);
            chrome.scripting
                .executeScript({
                    target: { tabId: tabId },
                    func: async () => {
                        const text = document
                            .querySelector("#userId")
                            ?.getAttribute("data-userId");
                        console.log("text", text);
                        if (text) {
                            await chrome.storage.local.set({ userId: text });

                            
                        }
                    },
                })
                .then(() => {
                    getWordNotLearned().then((item) => {
                        console.log("item", item);
                        wordNotLearned = item;
                        chrome.storage.local.set({ wordNotLearned });
                    })
                    
                    console.log("Script executed");
                })
                .catch((err) => {
                    console.log("Script failed to execute", err);
                });
        }
    }
});


const main = async () => {
    wordNotLearned = await getWordNotLearned();
    
    chrome.storage.local.set({ wordNotLearned });
    console.log("wordNotLearned", wordNotLearned);

    let settings = await getSettings();

    chrome.storage.local.onChanged.addListener(
        (changes: { [key: string]: chrome.storage.StorageChange }) => {
            if (changes.isAutoReminder) {
                settings.isAutoReminder = changes.isAutoReminder.newValue;
            }
            if (changes.reminderInterval) {
                settings.reminderInterval = changes.reminderInterval.newValue;
            }
            if (changes.langFrom) {
                settings.langFrom = changes.langFrom.newValue;
            }
            if (changes.langTo) {
                settings.langTo = changes.langTo.newValue;
            }
            if (changes.wordSetSave) {
                settings.wordSetSave = changes.wordSetSave.newValue;
            }
            if (changes.isHighlight) {
                settings.isHighlight = changes.isHighlight.newValue;
            }

            if (changes.wordNotLearned) {
                wordNotLearned = changes.wordNotLearned.newValue;
            }
        }
    );

    const interval = async () => {
        console.log("interval");
        if (settings.isAutoReminder === false) {
            console.log("isAutoReminder === false");
            return;
        }
        setTimeout(async () => {
            const word =
                wordNotLearned[
                    Math.floor(Math.random() * wordNotLearned.length)
                ];
            wordNotLearned.splice(wordNotLearned.indexOf(word), 1);

            console.log("word", word);
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id || 0, {
                    type: "REMEMBER",
                    word: word.name,
                    definition: word.meaning,
                    wordId: word.wordId,
                    learned: word.learned,
                });
            });

            await interval();
        }, settings.reminderInterval * 60 * 1000);
    };
    interval();

    chrome.commands.onCommand.addListener((command) => {
        if (command === "openRemindWord") {
            if (wordNotLearned.length === 0) {
                console.log("wordNotLearned.length === 0");
                return;
            }
            const word =
                wordNotLearned[
                    Math.floor(Math.random() * wordNotLearned.length)
                ];
            wordNotLearned.splice(wordNotLearned.indexOf(word), 1);
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0].status === "complete")
                    chrome.tabs.sendMessage(tabs[0].id || 0, {
                        type: "REMEMBER",
                        word: word.name,
                        definition: word.meaning,
                        wordId: word.wordId,
                        learned: word.learned,
                    });
            });
        } else if (command === "highlightWord") {
            if (settings.isHighlight) {
                getWordFromUser().then((words) => {
                    chrome.tabs.query(
                        { active: true, currentWindow: true },
                        (tabs) => {
                            chrome.tabs.sendMessage(tabs[0].id || 0, {
                                type: "HIGHLIGHT",
                                words: words,
                            });
                        }
                    );
                })
                
            }
        }
    });
};

main();

export {};
