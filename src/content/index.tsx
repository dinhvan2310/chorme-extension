import ReactDOM from "react-dom/client";
import AppInject from "./AppInject";
import "./index.css";
import RememberInject from "./RemmemberInject";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "FILTER") {
        // replace text
        const bodyText = document.querySelector("body")?.innerHTML;
        const key = request.data;
        const newBodyText = bodyText?.replace(
            new RegExp(key, "g"),
            `<span style="background-color: yellow">${key}</span>`
        );
        document.querySelector("body")!.innerHTML = newBodyText!;
    }
});

// Create a root element for the popup component and append it to the body
const popupRoot = document.createElement("div");
popupRoot.id = "popupRoot";
document.body.appendChild(popupRoot);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "REMEMBER") {
        console.log("REMEMBER", request);
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
            <RememberInject
                word={request.word}
                definition={request.definition}
            />
        );
    }
});

// Render the popup component
const popup = ReactDOM.createRoot(
    document.getElementById("popupRoot") as HTMLElement
);
popup.render(<AppInject />);

// funtions --------------------------------------------------------------------------------------------------------------

// const bodyText = document.querySelector("body")?.innerHTML;
// const key = "DESIGN";
// const newBodyText = bodyText?.replace(
//     new RegExp(key, "g"),
//     `<span style="background-color: yellow">${key}</span>`
// );
// document.querySelector("body")!.innerHTML = newBodyText!;

export {};
