// import { useEffect, useState } from "react";

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

import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import SignUpLayout from "../../layouts/SignUpLayout";
import { UserType } from "../../types/UserType";

function App() {
    const [user, setUser] = useState<UserType | null>(null);
    useEffect(() => {
        //  Set the theme
        const theme = localStorage.getItem("theme");
        if (theme) {
            document.body.dataset.theme = theme;
        } else {
            localStorage.setItem("theme", "light");
            document.body.dataset.theme = "light";
        }

        //  Load the Google fonts
    }, []);

    return <MainLayout />;
}

export default App;
