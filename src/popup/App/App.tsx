// import { useEffect, useState } from "react";

import { useEffect } from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import LoginPage from "../../components/Popup/PopupSignin/LoginPage";
import Settings from "../layout/Settings";
import PopupComponent from "../layout/PopupComponent";
import PopupTranslate from "../layout/PopupTranslate";
import PopupLayout from "../layout/PopupLayout";

// function App() {
//   const [isActivated, setIsActivated] = useState(false);

//   useEffect(() => {
//     if (!isActivated) {
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.tabs.sendMessage(
//           tabs[0].id || 0,
//           {
//             type: "DEACTIVATE",
//             mess: "Deactivate",
//           },
//           (response) => {
//             console.log("response", response);
//           }
//         );
//       });

//       return;
//     }

//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       chrome.tabs.sendMessage(
//         tabs[0].id || 0,
//         {
//           type: "ACTIVATE",
//           mess: "Hello from popup",
//         },
//         (response) => {
//           console.log("response", response);
//         }
//       );
//     });
//   }, [isActivated]);

//   return (
//     <div
//       style={{
//         height: 200,
//         width: 200,
//       }}
//     >
//       <h1>Popup</h1>
//       <button onClick={() => setIsActivated(!isActivated)}>
//         {isActivated ? "Deactivate" : "Activate"}
//       </button>
//     </div>
//   );
// }

// export default App;

function App() {
    // const handleLogin = async () => {
    //     // redirect new tab to login page
    //     const url = "https://www.google.com";
    //     // @ts-ignore
    //     chrome.tabs.create({ url });
    // };

    useEffect(() => {
        // WebFont.load({
        //     google: {
        //         families: ["Poppins:400,500,600,700,800"],
        //     },
        // });
        chrome.runtime.sendMessage({ type: "POPUP_MOUNTED" });
    }, []);

    const route = createMemoryRouter([
        {
            path: "/",
            element: <PopupLayout />,
            children: [
                {
                    path: "/translate",
                    element: <PopupTranslate />,
                },
                {
                    path: "/",
                    element: <PopupComponent />,
                },
                {
                    path: "/settings",
                    element: <Settings />,
                },
            ],
        },
        {
            path: "/signin",
            element: <LoginPage />,
        },
    ]);

    return <RouterProvider router={route} />;
}

export default App;
