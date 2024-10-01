import { Typography } from "antd";
import {
    Logout,
    Notepad2,
    RefreshLeftSquare,
    Setting2,
    Translate,
} from "iconsax-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../components/Button/ButtonComponent";
import TouchableOpacity from "../../components/TouchableOpacity/TouchableOpacity";
import { AuthContext } from "../../context/AuthProvider";
import { getWordNotLearned } from "../../firebase/wordAPI";
import { WordType } from "../../types/WordType";

function PopupComponent() {
    const navigate = useNavigate();
    const context = useContext(AuthContext);
    const [wordNotLearned, setWordNotLearned] = useState<WordType[]>([]);
    useEffect(() => {
        (async () => {
            const wordsNotLearned = (
                await chrome.storage.local.get("wordNotLearned")
            ).wordNotLearned;
            setWordNotLearned(wordsNotLearned);
        })();
    });

    if (!context) {
        return null; // or handle the null case appropriately
    }
    const { user, signOut } = context;

    return (
        <div
            style={{
                width: "500px",
                backgroundColor: "#f9fafb",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <div>
                <header
                    style={{
                        backgroundColor: "#fff",
                        height: 57,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: "0 16px",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #f1f2f6",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                chrome.tabs.create({
                                    url: "https://vocabulary-notebook-989d7.web.app",
                                });
                            }}
                        >
                            <img
                                src="icon.png"
                                alt="logo"
                                style={{
                                    height: 24,
                                    width: 24,
                                    objectFit: "cover",
                                }}
                            />
                        </TouchableOpacity>

                        <span
                            style={{
                                fontSize: 16,
                                fontWeight: 500,
                                color: "#000",
                                marginLeft: 16,
                            }}
                        >
                            Vocab Notebook
                        </span>
                    </div>
                    {user ? (
                        <div
                            style={{
                                borderRadius: "50%",
                                width: 36,
                                height: 36,
                                cursor: "pointer",
                                overflow: "hidden",
                            }}
                        >
                            <img
                                src={user.photoURL}
                                alt={"user"}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                // navigate("/signin");
                                chrome.tabs.create({
                                    url: "https://vocabulary-notebook-989d7.web.app/login",
                                });
                            }}
                            style={{
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#107cff",
                                cursor: "pointer",
                                color: "#fff",
                            }}
                        >
                            Sign In
                        </button>
                    )}
                </header>
                <div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            paddingLeft: 16,
                            paddingRight: 16,
                            paddingTop: 16,
                            paddingBottom: 16,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                marginBottom: 8,
                            }}
                        >
                            <ButtonComponent
                                text="Translate"
                                icon={<Translate size={26} color="#333" />}
                                onClick={() => {
                                    navigate("/translate");
                                }}
                                style={{ width: "100%", marginRight: 8 }}
                            />
                            <ButtonComponent
                                disabled={user ? false : true}
                                text="Notebook"
                                icon={
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Notepad2 size={26} color="#333" />
                                        <Typography.Text
                                            style={{
                                                fontSize: 10,
                                                color: "#666",
                                            }}
                                        >
                                            {user
                                                ? "Click to view"
                                                : "Sign in to use"}
                                        </Typography.Text>
                                    </div>
                                }
                                onClick={() => {
                                    navigate("/notebook");
                                }}
                                style={{ width: "100%" }}
                            />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                            }}
                        >
                            <ButtonComponent
                                disabled={user ? false : true}
                                text={
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography.Text
                                            style={{ fontSize: 14 }}
                                        >
                                            Remind Word
                                        </Typography.Text>
                                        <Typography.Text
                                            style={{
                                                fontSize: 10,
                                                color: "#666",
                                            }}
                                        >
                                            (Ctrl + Shift + D)
                                        </Typography.Text>
                                    </div>
                                }
                                icon={
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                    >
                                        <RefreshLeftSquare
                                            size={26}
                                            color="#333"
                                        />
                                        <Typography.Text
                                            style={{
                                                fontSize: 10,
                                                color: "#666",
                                            }}
                                        >
                                            {user
                                                ? wordNotLearned?.length +
                                                  " words left"
                                                : "Sign in to use"}
                                        </Typography.Text>
                                    </div>
                                }
                                onClick={async () => {
                                    const wordsNotLearned: WordType[] =
                                        await getWordNotLearned();
                                    const word =
                                        wordsNotLearned[
                                            Math.floor(
                                                Math.random() *
                                                    wordsNotLearned.length
                                            )
                                        ];
                                    chrome.tabs.query(
                                        { active: true, currentWindow: true },
                                        (tabs) => {
                                            chrome.tabs.sendMessage(
                                                tabs[0].id || 0,
                                                {
                                                    type: "REMEMBER",
                                                    word: word.name,
                                                    definition: word.meaning,
                                                    wordId: word.wordId,
                                                    learned: word.learned,
                                                }
                                            );
                                        }
                                    );
                                }}
                                style={{ width: "100%", marginRight: 8 }}
                            />
                            <ButtonComponent
                                text="Settings"
                                icon={<Setting2 size={26} color="#333" />}
                                onClick={() => navigate("/settings")}
                                style={{ width: "100%" }}
                            />
                        </div>
                    </div>
                    <div>
                        {user && (
                            <ButtonComponent
                                text="Logout"
                                iconPosition="left"
                                onClick={() => {
                                    signOut();
                                }}
                                style={{
                                    width: "100%",
                                    height: 54,
                                }}
                                icon={<Logout size={20} color="#333" />}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 40,
                    fontSize: 12,
                    color: "#333",
                    marginBottom: 8,
                }}
            >
                Created by Nezuko
            </div>
        </div>
    );
}

export default PopupComponent;
