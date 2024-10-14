import { Collapse, Form, InputNumber, Select, Switch, TreeSelect } from "antd";
import { ArrowLeft2 } from "iconsax-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TouchableOpacity from "../../components/TouchableOpacity/TouchableOpacity";
import { AuthContext } from "../../context/AuthProvider";
import { SettingsContext } from "../../context/SettingsContext";
import { getTreeStructure } from "../../firebase/wordSetAPI";
import { setSettings } from "../../apis/settings/settings";

function Settings() {
    const settingsData = useContext(SettingsContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [treeStructure, setTreeStructure] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const rs = await getTreeStructure();
            console.log(rs);
            setTreeStructure(rs);
        };
        fetchData();
    }, []);

    const items = [
        {
            key: "1",
            label: "General",
            children: (
                <>
                    <Form.Item label="Language from" name="langFrom">
                        <Select
                            defaultValue={settingsData?.langFrom}
                            value={settingsData?.langFrom}
                            onChange={(value) => {
                                if (!settingsData) return;
                                if (settingsData.setLangFrom)
                                    settingsData.setLangFrom(value);
                            }}
                            options={[
                                { label: "Auto Detect", value: "detect" },
                                { label: "English", value: "en" },
                                { label: "Vietnamese", value: "vi" },
                                { label: "Japanese", value: "ja" },
                                { label: "Chinese", value: "zh" },
                                { label: "Korean", value: "ko" },
                                { label: "French", value: "fr" },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="Language to" name="langTo">
                        <Select
                            defaultValue={settingsData?.langTo}
                            value={settingsData?.langTo}
                            onChange={(value) => {
                                if (!settingsData) return;
                                if (settingsData.setLangTo)
                                    settingsData.setLangTo(value);
                            }}
                            options={[
                                { label: "English", value: "en" },
                                { label: "Vietnamese", value: "vi" },
                                { label: "Japanese", value: "ja" },
                                { label: "Chinese", value: "zh" },
                                { label: "Korean", value: "ko" },
                                { label: "French", value: "fr" },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="Voice accent" name="voiceAccent">
                        <Select
                            defaultValue={settingsData?.voiceAccent}
                            value={settingsData?.voiceAccent}
                            onChange={(value) => {
                                if (!settingsData) return;
                                if (settingsData.setVoiceAccent)
                                    settingsData.setVoiceAccent(value);
                            }}
                            options={[
                                { label: "US English", value: "en-US" },
                                { label: "UK English", value: "en-GB" },
                                { label: "AU English", value: "en-AU" },
                                { label: "Vietnamese", value: "vi-VN" },
                                { label: "Japanese", value: "ja-JP" },
                                { label: "Chinese", value: "zh-CN" },
                                { label: "Korean", value: "ko-KR" },
                                { label: "French", value: "fr-FR" },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="Word set save" name="wordSetSave">
                        <TreeSelect
                            value={settingsData?.wordSetSave}
                            defaultValue={settingsData?.wordSetSave}
                            treeData={treeStructure}
                            onChange={(value) => {
                                if (!settingsData) return;
                                if (settingsData.setWordSetSave)
                                    settingsData.setWordSetSave(value);
                            }}
                        />
                    </Form.Item>
                </>
            ),
        },
        {
            key: "2",
            label: "Reminder",
            children: (
                <>
                    <Form.Item
                        name="autoReminder"
                        label="Auto reminder(Re-open chrome to apply changes)"
                    >
                        <Switch
                            defaultChecked={settingsData?.isAutoReminder}
                            value={settingsData?.isAutoReminder}
                            onChange={(value) => {
                                if (!settingsData) return;
                                if (settingsData.setIsAutoReminder)
                                    settingsData.setIsAutoReminder(value);
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Reminder interval (minutes)"
                        name="reminderInterval"
                    >
                        <InputNumber
                            min={1}
                            defaultValue={settingsData?.reminderInterval}
                            value={settingsData?.reminderInterval}
                            onChange={(value) => {
                                if (typeof value === "number") {
                                    if (!settingsData) return;
                                    if (settingsData.setReminderInterval)
                                        settingsData.setReminderInterval(value);
                                }
                            }}
                        />
                    </Form.Item>
                </>
            ),
        },
        {
            key: "3",
            label: "Highlight",
            children: (
                <>
                    <Form.Item name="isHighlight" label="Highlight words">
                        <Switch
                            defaultChecked={settingsData?.isHighlight}
                            value={settingsData?.isHighlight}
                            onChange={(value) => {
                                if (!settingsData) return;
                                if (settingsData.setIsHighlight)
                                    settingsData.setIsHighlight(value);
                            }}
                        />
                    </Form.Item>
                </>
            ),
        },
    ];

    return (
        <div
            style={{
                width: "500px",
                backgroundColor: "#f9fafb",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflowY: "scroll",
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
                                navigate("/");
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
                            Settings
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
            {/* // ----------------------------------------- */}
            <div
                style={{
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#fff",
                }}
            >
                <Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    autoComplete="off"
                    clearOnDestroy={true}
                >
                    <Collapse items={items} defaultActiveKey={["1"]} />
                </Form>
            </div>
            {/* // -------------------------------------------------- */}
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

export default Settings;
