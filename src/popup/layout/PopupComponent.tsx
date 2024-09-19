import { Logout, Notepad2, Setting2, Translate } from "iconsax-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import TouchableOpacity from "../../components/TouchableOpacity/TouchableOpacity";
import ButtonComponent from "../../components/Button/ButtonComponent";

function PopupComponent() {
    const navigate = useNavigate();
    const context = useContext(AuthContext);
    if (!context) {
        return null; // or handle the null case appropriately
    }
    const { user, signOut } = context;

    return (
        <div
            style={{
                width: "360px",
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
                        <TouchableOpacity>
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
                    <div
                        style={{
                            borderRadius: "50%",
                            width: 36,
                            height: 36,
                            cursor: "pointer",
                            overflow: "hidden",
                        }}
                    >
                        {user ? (
                            <img
                                src={user.photoURL}
                                alt={"user"}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        ) : (
                            <button
                                onClick={() => {
                                    navigate("/signin");
                                }}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#f9fafb",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                Sign In
                            </button>
                        )}
                    </div>
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
                                text="Notebook"
                                icon={<Notepad2 size={26} color="#333" />}
                                onClick={() => {
                                    chrome.tabs.create({
                                        url: "https://vocabulary-notebook-989d7.web.app",
                                    });
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
                                text="Translate"
                                icon={<Translate size={26} color="#333" />}
                                onClick={() => {
                                    chrome.tabs.query(
                                        { active: true, currentWindow: true },
                                        (tabs) => {
                                            chrome.tabs.sendMessage(
                                                tabs[0].id || 0,
                                                {
                                                    type: "REMEMBER",
                                                    word: "Translate",
                                                    definition:
                                                        "To convert text from one language to another",
                                                },
                                                (response) => {
                                                    console.log(
                                                        "response",
                                                        response
                                                    );
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
