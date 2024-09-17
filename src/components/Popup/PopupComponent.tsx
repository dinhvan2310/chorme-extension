import { Logout, Notepad2, Setting2, Translate } from "iconsax-react";
import ButtonComponent from "../Button/ButtonComponent";
import TouchableOpacity from "../TouchableOpacity/TouchableOpacity";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { User } from "firebase/auth";

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
                                        url: "https://vocab-notebook-reactjs.onrender.com/",
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
                                onClick={() => console.log("Translate")}
                                style={{ width: "100%", marginRight: 8 }}
                            />
                            <ButtonComponent
                                text="Settings"
                                icon={<Setting2 size={26} color="#333" />}
                                onClick={() => console.log("Hamberger Menu")}
                                style={{ width: "100%" }}
                            />
                        </div>
                    </div>
                    <div>
                        <ButtonComponent
                            text="Logout"
                            iconPosition="left"
                            onClick={() => console.log("Logout")}
                            style={{
                                width: "100%",
                                height: 54,
                            }}
                            icon={<Logout size={20} color="#333" />}
                        />
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
