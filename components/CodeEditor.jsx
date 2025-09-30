import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import useStore from "../store/store";

const defaultCodes = {
    c: "#include <stdio.h>\nint main() {\n    printf(\"Hello from C!\\n\");\n    return 0;\n}",
    cpp: "#include <iostream>\nusing namespace std;\nint main() {\n    cout << \"Hello from C++!\" << endl;\n    return 0;\n}",
    python: "print('Hello from Python!')",
    java: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello from Java!\");\n    }\n}",
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
    onCodeChange = (code) => { },
    onOutputChange = (output) => { },
}) => {
    const [language, setLanguage] = useState(defaultLanguage);
    const [code, setCode] = useState(defaultCodes[defaultLanguage]);
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const {setMessage}=useStore()
    useEffect(() => {
        const defaultCode = defaultCodes[language];
        setCode(defaultCode);
        onCodeChange(defaultCode);
    }, [language]);

    const handleRun = async () => {
        setIsRunning(true)
        try {
            const token = sessionStorage.getItem("token");
            const res = await fetch("http://localhost:3000/student/run", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({language,code}),
            });
            if (res.ok) {
                const response = await res.json();
                setOutput(response.output)
                setMessage({ color: "green", message: "Executed successfully" });
            } else
                setMessage({ color: "crimson", message: "error creating" });
            } catch (error) {
            setMessage({ color: "crimson", message: "network error" });
            } finally {
            setIsRunning(false);
            }
    };
    const handleCodeChange = (value) => {
        setCode(value);
        onCodeChange(value);
    };
    return (
        <div className="code-editor">
            <div className="editor">
                <Editor
                    height="100%"
                    width="100%"
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
            <div className="output">
                <div className="lang-selection">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}>
                        {languages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                    <button className="join" onClick={handleRun} disabled={isRunning}>
                        {isRunning ? "Running..." : "Run"}
                    </button>
                </div>
                <div className="output-con">
                    <strong>Output:</strong>
                    <pre>{output}</pre>
                </div>
            </div>
        </div>
    );
};
