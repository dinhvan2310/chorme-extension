// import { useEffect, useState } from "react";

import { useEffect } from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import Settings from "../layout/Settings";
import PopupComponent from "../layout/PopupComponent";
import PopupTranslate from "../layout/PopupTranslate";
import PopupLayout from "../layout/PopupLayout";
import PopupNotebook from "../layout/PopupNotebook";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PopupWordSet from "../layout/PopupWordSet";
import PopupWord from "../layout/PopupWord";

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
                {
                    path: "/notebook",
                    element: <PopupNotebook />,
                },
                {
                    path: "/folders/:folderid",
                    element: <PopupWordSet />,
                },
                {
                    path: "/folders/:folderid/wordsets/:wordsetid",
                    element: <PopupWord />,
                },
            ],
        },
    ]);

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                // staleTime: 1000 * 60 * 5
                refetchOnWindowFocus: false,
            },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={route} />
        </QueryClientProvider>
    );
}

export default App;
