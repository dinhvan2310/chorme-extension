
// background.js
chrome.runtime.onInstalled.addListener(async() => {
    // setTimeout(() => {
    //     chrome.runtime.sendMessage({
    //         type: "emailLink",
    //         emailLink: 'https://vocabulary-notebook-989d7.firebaseapp.com',
    //         email: 'dinhvan@gmail.com',
    //     })
    // }, 5000)
    


    // Listen for messages from the service worker
    // const handleMessage = async (request: {
    //     type: string;
    //     email: any;
    //     emailLink: any;
    // }) => {
    //     console.log("request", request);
    //     if (request.type === "emailLink") {
    //         console.log("emailLink from background.js");
    //         await signInWithEmailLink(
    //             auth,
    //             request.email,
    //             request.emailLink
    //         );

    //         // chrome.runtime.onMessage.removeListener(handleMessage);
    //     }
    // };

    // chrome.runtime.onMessage.addListener(handleMessage);
    
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
        const extensionOrigin = `extension://ajgkconnckilakdnailkmmofclfkdnie/index.html`;

        console.log("urlOrigin", urlOrigin);

        if (urlOrigin === extensionOrigin) {
            const email = (await chrome.storage.local.get("emailForSignIn")).emailForSignIn;
            const tabext = (await chrome.storage.local.get("tabext")).tabext;
            console.log("tabext", tabext);
            chrome.runtime.sendMessage( {
                type: "emailLink",
                emailLink,
                email,
            });
            // Get email from local storage
            // chrome.storage.local.get("emailForSignIn", (data) => {
            //     const email = data.emailForSignIn;
            //     // Send a message to the content script with emailLink and email
            //     chrome.storage.local.get("tabext", (data1) => {
            //         chrome.tabs.sendMessage(data1.tabext.id, {
            //             type: "emailLink",
            //             emailLink,
            //             email,
            //         });
            //     });
            // });
        }
    }
});


export { };
