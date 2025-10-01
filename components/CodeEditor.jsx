import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import SockJS from "sockjs-client";
import { Client, Stomp } from "@stomp/stompjs";
import useStore from "../store/store";

const defaultCodes = {
    c: "#include <stdio.h>\nint main() {\n    printf(\"Hello from C!\\n\");\n    return 0;\n}",
    cpp: "#include <iostream>\nusing namespace std;\nint main() {\n    setvbuf(stdout, nullptr, _IONBF, 0);\n    cout << \"Hello from C++!\" << endl;\n    return 0;\n}",
    python: "print('Hello from Python!')",
    java: "import java.io.PrintWriter;\n\nclass Main {\n    public static void main(String[] args) {\n        // Use PrintWriter with autoflush to guarantee immediate output\n        PrintWriter out = new PrintWriter(System.out, true);\n        out.println(\"Hello from Java!\");\n    }\n}",
    javascript: "console.log('Hello from JavaScript!');",
};
const languages = [
    { label: "C", value: "c" },
    { label: "C++", value: "cpp" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "JavaScript", value: "javascript" },
];

export const CodeEditor = ({
    width = "100%",
    height = "500px",
    defaultLanguage = "javascript",
    onCodeChange = () => { },
    onOutputChange = () => { },
}) => {
    const [language, setLanguage] = useState(defaultLanguage);
    const [code, setCode] = useState(defaultCodes[defaultLanguage]);
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [client, setClient] = useState(null);
    const [processId,setProcessId]=useState("");
    const { setMessage,userData } = useStore();
    useEffect(() => {
        const defaultCode = defaultCodes[language];
        setCode(defaultCode);
        onCodeChange(defaultCode);
    }, [language]);
    const handleCodeChange = (value) => {
        setCode(value);
        onCodeChange(value);
    };
    useEffect(() => {
    if (client && processId!=="") {
        client.subscribe("/topic/output/" + processId, (msg) => {
            const outputdata = JSON.parse(msg.body);
            setOutput(prev => prev + outputdata.line);
        });
    }
    }, [processId, client]);
    useEffect(() => {
        const socket = new SockJS("http://localhost:3000/ws");
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
            console.log("Connected");
            stompClient.subscribe("/topic/output", (msg) => {
                const receivedMsg = msg;
            });
            stompClient.subscribe("/topic/output/"+userData.id,(msg)=>{
                const processDetails=JSON.parse(msg.body)
                setProcessId(processDetails.processId);
            })
        });
        setClient(stompClient);
        return () => {
            if (stompClient.connected) {
                stompClient.disconnect(() => console.log("Disconnected"));
            }
        };
    }, []);
    const handleRun = () => {
        if (!client || !client.connected) return;
        setOutput("")
        client.send("/app/run", {}, JSON.stringify({ language,code,oldProcessId:processId,studentId:userData.id}));
    };
    const handleSendInput = () => {
        if (!client || !client.connected) return;
        client.send("/app/input", {}, JSON.stringify({ input: userInput,processId}));
    };
    return (
        <div className="code-editor" style={{ display: "flex", gap: "10px" }}>
            <div className="editor" style={{ width: "50%" }}>
                <Editor
                    height={height}
                    width={width}
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={handleCodeChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        automaticLayout: true,
                    }}
                />
            </div>

            <div
                className="output"
                style={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div className="lang-selection" style={{ marginBottom: "10px" }}>
                    <select value={language} onChange={(e) =>{setProcessId(""); setLanguage(e.target.value)}}>
                        {languages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                    <button
                        className="join"
                        onClick={handleRun}
                        disabled={isRunning}
                        style={{ marginLeft: "10px" }}
                    >
                        {isRunning ? "Running..." : "Run"}
                    </button>
                </div>

                <div
                    className="output-con"
                    style={{
                        flexGrow: 1,
                        overflowY: "auto",
                        marginTop: "10px",
                        background: "#1e1e1e",
                        color: "#fff",
                        padding: "10px",
                        borderRadius: "4px",
                    }}
                >
                    <strong>Output:</strong>
                    <pre>{output}</pre>
                </div>

                <div className="input-con" style={{ marginTop: "10px" }}>
                    <input
                        type="text"
                        placeholder="Enter input..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        style={{ width: "80%", padding: "5px" }}
                    />
                    <button onClick={handleSendInput} style={{ marginLeft: "5px" }}>
                        Send Input
                    </button>
                </div>
            </div>
        </div>
    );
};
