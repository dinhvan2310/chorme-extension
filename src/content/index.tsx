import ReactDOM from "react-dom/client";
import AppInject from "./AppInject";
import "./index.css";

// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//     if (msg.type === "DEACTIVATE") {
//         document.body.style.backgroundColor = "white";
//     } else if (msg.type === "ACTIVATE") {
//         document.body.style.backgroundColor = "red";
//     }
// });

// Create a root element for the popup component and append it to the body
const popupRoot = document.createElement("div");
popupRoot.id = "popupRoot";
document.body.appendChild(popupRoot);

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
