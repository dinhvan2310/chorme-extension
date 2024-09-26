import React, { createContext, useEffect, useMemo, useState } from "react";
import { getUser } from "../firebase/userAPI";
import { UserType } from "../types/UserType";

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<any>(null);

function AuthProvider(props: AuthProviderProps) {
    const { children } = props;
    const [user, setUser] = useState<UserType | null>(null);

    const signOut = () => {
        chrome.storage.local.remove("userId");
        setUser(null);
    };

    useEffect(() => {
        chrome.storage.local.get("userId", (result) => {
            if (result.userId) {
                getUser(result.userId).then((user) => {
                    if (!user) {
                        signOut();
                        return setUser(null);
                    }
                    return setUser(user);
                });
            } else {
                setUser(null);
            }
        });

        chrome.storage.onChanged.addListener(
            (changes: { [key: string]: chrome.storage.StorageChange }) => {
                if (changes.userId) {
                    getUser(changes.userId.newValue).then((user) => {
                        if (!user) {
                            signOut();
                            return setUser(null);
                        }
                        return setUser(user);
                    });
                }
            }
        );

        // if (auth.currentUser) {
        //     setUser({
        //         userId: auth.currentUser.uid,
        //         email: auth.currentUser.email ?? "",
        //         name: auth.currentUser.displayName ?? "",
        //         photoURL: auth.currentUser.photoURL ?? "",
        //         createAt: Timestamp.fromDate(
        //             new Date(auth.currentUser.metadata.creationTime ?? "")
        //         ),
        //         provider: "google.com",
        //     });
        // }

        // unsubscribeAuth = auth.onAuthStateChanged(async (userAuth) => {
        //     if (userAuth) {
        //         setUser({
        //             userId: userAuth.uid,
        //             email: userAuth.email ?? "",
        //             name: userAuth.displayName ?? "",
        //             photoURL: userAuth.photoURL ?? "",
        //             createAt: Timestamp.fromDate(
        //                 new Date(userAuth.metadata.creationTime ?? "")
        //             ),
        //             provider: "google.com",
        //         });
        //         chrome.storage.local.set({
        //             refreshToken: userAuth.refreshToken,
        //         });
        //     } else {
        //         setUser(null);
        //         chrome.storage.local.remove("refreshToken");
        //     }
        // });

        // Listen for messages from the service worker
        // const handleMessage = async (request: {
        //     type: string;
        //     email: any;
        //     emailLink: any;
        // }) => {
        //     console.log("request", request);
        //     if (request.type === "emailLink") {
        //         console.log("emailLink from background.js");
        //         const rs = await signInWithEmailLink(
        //             auth,
        //             request.email,
        //             request.emailLink
        //         );
        //     }
        // };

        // chrome.runtime.onMessage.addListener(handleMessage);

        // return () => {
        //     if (unsubscribeAuth) {
        //         unsubscribeAuth();
        //     }

        //     chrome.runtime.onMessage.removeListener(handleMessage);
        // };
    }, []);

    const value = useMemo(() => {
        return {
            user,
            signOut,
        };
    }, [user]);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export default AuthProvider;
export { AuthContext };
