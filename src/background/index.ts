// background.js

import { getSettings } from "../apis/settings/settings";
import { getWordNotLearned } from "../firebase/wordAPI";

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // const uid = await chrome.storage.local.get('userId')
    if (changeInfo.url) {
        const extensionOrigin = "https://vocabulary-notebook-989d7.web.app";

        console.log(changeInfo.url, extensionOrigin);
        if (
            changeInfo.url === extensionOrigin ||
            changeInfo.url === `${extensionOrigin}/`
        ) {
            console.log("changeInfo.url === extensionOrigin");
            console.log("tabId", tabId);
            chrome.scripting
                .executeScript({
                    target: { tabId: tabId },
                    func: () => {
                        const text = document
                            .querySelector("#userId")
                            ?.getAttribute("data-userId");
                        console.log("text", text);
                        if (text) {
                            chrome.storage.local.set({ userId: text });
                        } else {
                            chrome.storage.local.remove("userId");
                        }
                    },
                })
                .then(() => {
                    console.log("Script executed");
                })
                .catch((err) => {
                    console.log("Script failed to execute", err);
                });
        }
    }
});

const main = async () => {
    const wordNotLearned = await getWordNotLearned();
    console.log("wordNotLearned", wordNotLearned);
    chrome.storage.local.set({ wordNotLearned });

    let settings = await getSettings();


    chrome.storage.local.onChanged.addListener(
        (changes: { [key: string]: chrome.storage.StorageChange }) => {
            settings = changes.settings.newValue;
        }
    );

    chrome.commands.onCommand.addListener((command) => {
        if (command === "openRemindWord") {
            const word =
            wordNotLearned[Math.floor(Math.random() * wordNotLearned.length)];
        wordNotLearned.splice(wordNotLearned.indexOf(word), 1);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id || 0, {
                type: "REMEMBER",
                word: word.name,
                definition: word.meaning,
                wordId: word.wordId,
                learned: word.learned,
            });
        });
        }
    })
};

main();

export {};
