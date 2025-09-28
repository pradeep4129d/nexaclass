import React, { useState } from "react";
import Editor from "@monaco-editor/react";

export const CodeEditor = () => {
    const [code, setCode] = useState("// Write your code here");

    return (
        <div className="editor-container">
            <Editor
                height="400px"
                width="800px"
                language='javascript'
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value)}
            />
            <button
                className="run-btn"
            >
                Run
            </button>
        </div>
    );
};
