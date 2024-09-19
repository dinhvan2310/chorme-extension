
// background.js
chrome.runtime.onInstalled.addListener(async() => {
    
    
})


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SET_EMAIL_FOR_SIGN_IN") {
        chrome.storage.local.set({ emailForSignIn: message.email });
        chrome.storage.local.set({ tabext: sender.id });
        console.log("sender.tab", sender);
        console.log("SET_EMAIL_FOR_SIGN_IN", message.email);
    }
});

chrome.tabs.onUpdated.addListener(async(tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        const emailLink = changeInfo.url;
        const urlOrigin = new URL(emailLink).origin;
        const extensionOrigin = `https://vocabulary-notebook-989d7.firebaseapp.com`;

        console.log("urlOrigin", urlOrigin);

        if (urlOrigin === extensionOrigin) {
            const email = (await chrome.storage.local.get("emailForSignIn")).emailForSignIn;
            const tabext = (await chrome.storage.local.get("tabext")).tabext;
            console.log("tabext", tabext);
            
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                if (message.type === "POPUP_MOUNTED") {
                    chrome.runtime.sendMessage( {
                        type: "emailLink",
                        emailLink,
                        email,
                    });
                }
            })}
        }
});


export { };
