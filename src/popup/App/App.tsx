// import { useEffect, useState } from "react";

import { createMemoryRouter, RouterProvider } from "react-router-dom";
import PopupLayout from "../../components/Popup/PopupLayout";
import PopupTranslate from "../../components/Popup/PopupTranslate/PopupTranslate";
import PopupComponent from "../../components/Popup/PopupComponent";

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
            ],
        },
    ]);

    return <RouterProvider router={route} />;
}

export default App;
