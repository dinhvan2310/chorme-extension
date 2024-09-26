import ReactDOM from "react-dom/client";
import SettingsProvider from "../context/SettingsContext";
import AppInject from "./AppInject";
import "./index.css";
import RememberInject from "./RemmemberInject";
import { updateWord } from "../firebase/wordAPI";

// Create a root element for the popup component and append it to the body
const popupRoot = document.createElement("div");
popupRoot.id = "popupRoot";
document.body.appendChild(popupRoot);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "REMEMBER") {
        // Render the RememberInject component
        if (document.getElementById("rememberRoot")) {
            document.getElementById("rememberRoot")?.remove();
        }
        const rememberRoot = document.createElement("div");
        rememberRoot.id = "rememberRoot";
        document.body.appendChild(rememberRoot);
        const remember = ReactDOM.createRoot(
            document.getElementById("rememberRoot") as HTMLElement
        );
        remember.render(
            <SettingsProvider>
                <RememberInject
                    word={request.word}
                    definition={request.definition}
                    onRemembered={() => {
                        updateWord(
                            request.wordId,
                            request.learned === "notLearned"
                                ? "learning"
                                : "mastered"
                        );
                    }}
                />
            </SettingsProvider>
        );
    }
});

// Render the popup component
const popup = ReactDOM.createRoot(
    document.getElementById("popupRoot") as HTMLElement
);
popup.render(
    <SettingsProvider>
        <AppInject />
    </SettingsProvider>
);

// funtions --------------------------------------------------------------------------------------------------------------

// const bodyText = document.querySelector("body")?.innerHTML;
// const key = "DESIGN";
// const newBodyText = bodyText?.replace(
//     new RegExp(key, "g"),
//     `<span style="background-color: yellow">${key}</span>`
// );
// document.querySelector("body")!.innerHTML = newBodyText!;

export {};
