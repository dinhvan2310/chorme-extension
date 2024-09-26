import { useQuery } from "@tanstack/react-query";
import { Button, List } from "antd";
import { ArrowLeft2, Edit2, Refresh2 } from "iconsax-react";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import TouchableOpacity from "../../components/TouchableOpacity/TouchableOpacity";
import { AuthContext } from "../../context/AuthProvider";
import { getWordSets } from "../../firebase/wordSetAPI";
import FolderType from "../../types/FolderType";
import { WordSetType } from "../../types/WordSetType";

function PopupWordSet() {
    const navigate = useNavigate();
    const context = useContext(AuthContext);
    const { user } = context;
    const { folderid } = useParams();
    const location = useLocation();
    const folder = location.state.folder as FolderType;

    const [startAt, setStartAt] = useState(0);

    const fetchWordSets = async () => {
        if (!user) return null;
        const data = await getWordSets(folderid, startAt, 4, "modifiedAt");
        return data;
    };
    // Query
    const query = useQuery({
        queryKey: ["wordset", startAt],
        queryFn: fetchWordSets,
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
                            {folder.name}
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
                                        url: `https://vocabulary-notebook-989d7.web.app/user/${user.userId}/folders/${folderid}`,
                                    });
                                }}
                                title="Edit Word Sets"
                                icon={<Edit2 size={16} />}
                            >
                                Edit or create word sets
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
            {/* //------------------------------------------ */}
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
                        style={{
                            width: "100%",
                        }}
                        pagination={{
                            position: "bottom",
                            align: "end",
                            pageSize: 4,
                            total: query.data?.numOfTotalWordSets,
                            onChange: (page, pageSize) => {
                                setStartAt((page - 1) * pageSize);
                            },
                        }}
                        dataSource={query.data?.wordSets}
                        renderItem={(item: WordSetType, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    title={
                                        <Link
                                            to={`/folders/${folderid}/wordsets/${item.wordsetId}`}
                                            state={{
                                                wordSet: item,
                                            }}
                                        >
                                            {item.name}
                                        </Link>
                                    }
                                    description={
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <span>
                                                {item.words?.length ?? 0} words
                                            </span>
                                            <span>
                                                <Refresh2
                                                    size={16}
                                                    color="var(--secondary-text-color)"
                                                    className="mr-2"
                                                />
                                                {"Modified at: "}
                                                <span
                                                    style={{
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {item.modifiedAt
                                                        ?.toDate()
                                                        .toDateString()}
                                                </span>
                                            </span>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </div>
            </div>

            {/* //-------------------------------- */}
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

export default PopupWordSet;
