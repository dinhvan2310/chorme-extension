import { Unsubscribe } from "firebase/auth";
import { signInWithEmailLink } from "firebase/auth/web-extension";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { auth } from "../firebase/firebase-config";
import { UserType } from "../types/UserType";

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<any>(null);

const signOut = () => {
    auth.signOut().then(() => {});
};

function AuthProvider(props: AuthProviderProps) {
    const { children } = props;
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        let unsubscribeAuth: Unsubscribe | null = null;
        if (auth.currentUser) {
            setUser({
                userId: auth.currentUser.uid,
                email: auth.currentUser.email ?? "",
                name: auth.currentUser.displayName ?? "",
                photoURL: auth.currentUser.photoURL ?? "",
            });
        }

        unsubscribeAuth = auth.onAuthStateChanged(async (userAuth) => {
            if (userAuth) {
                setUser({
                    userId: userAuth.uid,
                    email: userAuth.email ?? "",
                    name: userAuth.displayName ?? "",
                    photoURL: userAuth.photoURL ?? "",
                });
            } else {
                setUser(null);
            }
        });

        // Listen for messages from the service worker
        const handleMessage = async (request: {
            type: string;
            email: any;
            emailLink: any;
        }) => {
            console.log("request", request);
            if (request.type === "emailLink") {
                console.log("emailLink from background.js");
                await signInWithEmailLink(
                    auth,
                    request.email,
                    request.emailLink
                );
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);

        return () => {
            if (unsubscribeAuth) {
                unsubscribeAuth();
            }

            chrome.runtime.onMessage.removeListener(handleMessage);
        };
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
