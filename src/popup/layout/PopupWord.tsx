import { useQuery } from "@tanstack/react-query";
import { Button, List, Typography } from "antd";
import { ArrowLeft2, Edit2, Notepad, Star1, VolumeHigh } from "iconsax-react";
import { useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SpaceComponent from "../../components/Space/SpaceComponent";
import TouchableOpacity from "../../components/TouchableOpacity/TouchableOpacity";
import { AuthContext } from "../../context/AuthProvider";
import { getWords, updateWord } from "../../firebase/wordAPI";
import { WordSetType } from "../../types/WordSetType";
import { WordType } from "../../types/WordType";
import { SettingsContext } from "../../context/SettingsContext";

function PopupWord() {
    const navigate = useNavigate();
    const context = useContext(AuthContext);
    const { user } = context;
    const { folderid, wordsetid } = useParams();
    const location = useLocation();
    const wordSet = location.state.wordSet as WordSetType;
    const settingsData = useContext(SettingsContext);

    const fetchWords = async () => {
        if (!wordsetid) return null;
        const data = await getWords(wordsetid);
        data.sort((a, b) => {
            if (a.learned && !b.learned) {
                return -1;
            }
            if (!a.learned && b.learned) {
                return 1;
            }
            return 0;
        });
        console.log("word", data);
        return data;
    };

    const query = useQuery({
        queryKey: ["words", wordsetid],
        queryFn: fetchWords,
        staleTime: 0,
    });

    return (
        <div
            style={{
                width: "500px",
                backgroundColor: "#f9fafb",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflowY: "auto",
                scrollbarWidth: "thin",
                scrollbarColor: "#fff #3a3b3c",
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
                                // lui 1 step
                                navigate(-1);
                            }}
                        >
                            <ArrowLeft2 size={20} color="#333" />
                        </TouchableOpacity>
                        <span
                            style={{
                                fontSize: 16,
                                fontWeight: 600,
                                color: "#000",
                                marginLeft: 16,
                            }}
                        >
                            {wordSet.name}
                        </span>
                    </div>

                    {user ? (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Button
                                type="default"
                                onClick={() => {
                                    chrome.tabs.create({
                                        url: `https://vocabulary-notebook-989d7.web.app/user/${user.userId}/folders/${folderid}/wordset/${wordsetid}`,
                                    });
                                }}
                                title="Edit Word Set"
                                icon={<Edit2 size={16} />}
                            >
                                Add or Edit Word
                            </Button>
                            <div
                                style={{
                                    marginLeft: 16,
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
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                navigate("/signin");
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
            </div>

            {/* // ------------------------------------------ */}
            <div
                style={{
                    padding: 16,
                }}
            >
                <div
                    style={{
                        padding: 16,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        textAlign: "left",
                        color: "#333",
                        backgroundColor: "#fff",
                        borderRadius: 8,
                        border: "1px solid #f1f2f6",
                        overflow: "hidden",
                    }}
                >
                    <List
                        style={{ width: "100%" }}
                        dataSource={query.data ?? []}
                        renderItem={(item: WordType, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    title={
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Typography.Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {item.name}
                                            </Typography.Text>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <TouchableOpacity
                                                    style={{}}
                                                    onPress={() => {
                                                        const synth =
                                                            window.speechSynthesis;
                                                        const voices =
                                                            synth.getVoices();
                                                        const voice =
                                                            voices.find(
                                                                (voice) =>
                                                                    voice.lang ===
                                                                    settingsData?.voiceAccent
                                                            );
                                                        const utterThis =
                                                            new SpeechSynthesisUtterance(
                                                                item.name
                                                            );
                                                        utterThis.voice =
                                                            voice ?? voices[0];
                                                        synth.speak(utterThis);
                                                    }}
                                                >
                                                    <VolumeHigh
                                                        size="20"
                                                        style={{}}
                                                    />
                                                </TouchableOpacity>
                                                <SpaceComponent width={8} />
                                                <TouchableOpacity
                                                    onPress={async () => {
                                                        if (!item.wordId)
                                                            return;
                                                        let learned:
                                                            | "notLearned"
                                                            | "learning"
                                                            | "mastered" =
                                                            "notLearned";
                                                        if (
                                                            item.learned ===
                                                            "notLearned"
                                                        ) {
                                                            learned =
                                                                "learning";
                                                        }
                                                        if (
                                                            item.learned ===
                                                            "learning"
                                                        ) {
                                                            learned =
                                                                "mastered";
                                                        }
                                                        if (
                                                            item.learned ===
                                                            "mastered"
                                                        ) {
                                                            learned =
                                                                "notLearned";
                                                        }
                                                        await updateWord(
                                                            item.wordId,
                                                            learned
                                                        );
                                                        query.refetch();
                                                    }}
                                                >
                                                    {item.learned ===
                                                    "notLearned" ? (
                                                        <Star1
                                                            size={20}
                                                            color="#333"
                                                        />
                                                    ) : item.learned ===
                                                      "learning" ? (
                                                        <Star1
                                                            size={20}
                                                            color="#f1c40f"
                                                            variant="Bulk"
                                                        />
                                                    ) : (
                                                        <Star1
                                                            variant="Bold"
                                                            size={20}
                                                            color="#f1c40f"
                                                        />
                                                    )}
                                                </TouchableOpacity>
                                            </div>
                                        </div>
                                    }
                                    description={
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <Typography.Text
                                                style={{
                                                    whiteSpace: "pre-wrap",
                                                }}
                                            >
                                                {item.meaning.replace(
                                                    /\\n/g,
                                                    "\n"
                                                )}
                                            </Typography.Text>
                                            <SpaceComponent height={12} />
                                            {item.contexts &&
                                                item.contexts.map(
                                                    (context: string) => (
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                marginBottom: 4,
                                                            }}
                                                            key={context}
                                                        >
                                                            <div>
                                                                <Notepad
                                                                    size={12}
                                                                    style={{
                                                                        marginRight: 4,
                                                                    }}
                                                                />
                                                            </div>
                                                            <Typography.Text
                                                                style={{
                                                                    whiteSpace:
                                                                        "pre-wrap",
                                                                }}
                                                            >
                                                                {" "}
                                                                {context.replace(
                                                                    /\\n/g,
                                                                    "\n"
                                                                )}
                                                            </Typography.Text>
                                                        </div>
                                                    )
                                                )}
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </div>
            </div>
            {/* // ------------------------------------------ */}
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

export default PopupWord;
