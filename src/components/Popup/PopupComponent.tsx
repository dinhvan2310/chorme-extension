import { Logout, Setting2, Translate } from "iconsax-react";
import ButtonComponent from "../Button/ButtonComponent";
import TouchableOpacity from "../TouchableOpacity/TouchableOpacity";
import { useNavigate } from "react-router-dom";

function PopupComponent() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                width: 384,
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
                        <img
                            style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                            }}
                            src="https://firebasestorage.googleapis.com/v0/b/vocabulary-notebook-989d7.appspot.com/o/images%2F1725654565743.jpg?alt=media&token=aa2bf9e8-c8e0-4eb7-89a1-17865a1c2caa"
                            alt="profile"
                        />
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
                                icon={<Translate size={20} color="#333" />}
                                onClick={() => {
                                    navigate("/translate");
                                }}
                                style={{ width: "100%", marginRight: 8 }}
                            />
                            <ButtonComponent
                                text="Notebook"
                                icon={<Translate size={20} color="#333" />}
                                onClick={() => console.log("Hamberger Menu")}
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
                                icon={<Translate size={20} color="#333" />}
                                onClick={() => console.log("Translate")}
                                style={{ width: "100%", marginRight: 8 }}
                            />
                            <ButtonComponent
                                text="Settings"
                                icon={<Setting2 size={20} color="#333" />}
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
