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
    test="",
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
    const [processId, setProcessId] = useState("");
    const { setMessage, userData } = useStore();
    const [error,setError]=useState(false)
    const [showOutput,setShowOutput]=useState(false)
    const [showEditor,setShowEditor]=useState(false)
    useEffect(() => {
        const defaultCode = defaultCodes[language];
        setCode(defaultCode);
        onCodeChange(defaultCode);
    }, [language]);
    const handleCodeChange = (value) => {
        setCode(value);
        onCodeChange(value);
    };
    console.log(output)
    useEffect(() => {
        if (client && processId !== "") {
            client.subscribe("/topic/output/" + processId, (msg) => {
                const outputdata = JSON.parse(msg.body);
                console.log(outputdata)
                setOutput(prev => prev + outputdata.line + '\n');
                setError(outputdata.type==="stderr"?true:false);
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
            stompClient.subscribe("/topic/output/" + userData.id, (msg) => {
                const processDetails = JSON.parse(msg.body)
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
        setIsRunning(true)
        if (!client || !client.connected) return;
        setOutput("")
        client.send("/app/run", {}, JSON.stringify({ language, code, oldProcessId: processId, studentId: userData.id }));
        setIsRunning(false)
    };
    const handleSendInput = () => {
        if (!client || !client.connected) return;
        client.send("/app/input", {}, JSON.stringify({ input: userInput, processId }));
        setUserInput("")
    };
    return (
        <div className={"code-editor "+test} style={{ position: "relative" }}>
            <div className={"editor "+showEditor+" "+test}>
                <Editor
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
            <div className={"run-bar "+test}>
                <div className="lang-selection run" style={{ marginBottom: "10px" }}>
                    <select value={language} onChange={(e) => { setProcessId(""); setLanguage(e.target.value) }}>
                        {languages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                    <div className="nav-btns">
                        <button className="join run" onClick={()=>{setShowOutput(false);setShowEditor(false)}}><ion-icon name="code-slash-outline"></ion-icon></button>
                        <hr />
                        <button className="join run" onClick={()=>{setShowEditor(true);setShowOutput(true)}}><ion-icon name="log-out-outline"></ion-icon></button>
                    </div>
                    <button
                        className="join run"
                        onClick={handleRun}
                        disabled={isRunning}
                        style={{ marginLeft: "10px" }}
                    >
                        <ion-icon name="play-outline"></ion-icon>
                    </button>
                </div>
            </div>
            <div className={"output "+showOutput+" test"}>
                <div className="lang-selection off" style={{ marginBottom: "10px" }}>
                    <select value={language} onChange={(e) => { setProcessId(""); setLanguage(e.target.value) }}>
                        {languages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                    <button
                        className="join run"
                        onClick={handleRun}
                        disabled={isRunning}
                        style={{ marginLeft: "10px" }}
                    >
                        <ion-icon name="play-outline"></ion-icon>
                    </button>
                </div>
                <strong>Output:</strong>
                <div className={"output-con "+test}>
                    <div className={"out "+error}>
                        <pre>{output}</pre>
                        <div className="input-con">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                style={{ width: "80%", padding: "5px" }}
                                autoFocus
                                onKeyDown={(e)=>{
                                    if(e.key==='Enter'){
                                        setOutput(prev => prev + userInput + '\n');
                                        handleSendInput();
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
