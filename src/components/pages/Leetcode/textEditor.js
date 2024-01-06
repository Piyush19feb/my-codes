import React, { useState, useEffect } from "react";
import "./textEditor.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeEditor = (props) => {
  const [content, setContent] = useState(props.data.code);
  const [code_lan, setCodelan] = useState(props.data.lan);
  const [code_info, setCode_info] = useState(props.data.info);
  const [edit_on, setedit_on] = useState(props.viewOnly);
  const [last_update, setLastUpdate] = useState(Date.now());
  // const update_atInterval = () => {
  //   var index = props.data.index;
  //   console.log("useefeect or butoon clicked",index);
  //   props.data.updatecell(index,content,"code_lan",code_lan,last_update);
  //   setLastUpdate(Date.now());
  // };
  const Lan_list = [
    {
      label: "javascript",
      value: "javascript",
    },
    {
      label: "python",
      value: "python",
    },
    {
      label: "c++",
      value: "cpp",
    },
    {
      label: "html",
      value: "html",
    },
  ];
  const onChange = (lan, code, info) => {
    setContent(code);
    setCodelan(lan);
    setCode_info(info);
    let solution = { lan: lan, code: code, info:info };
    props.onChange(solution);
  };

  const handleKeyDown = (evt) => {
    let value = content,
      selStartPos = evt.currentTarget.selectionStart;

    console.log(evt.currentTarget);

    // handle 4-space indent on
    if (evt.key === "Tab") {
      value =
        value.substring(0, selStartPos) +
        "    " +
        value.substring(selStartPos, value.length);
      evt.currentTarget.selectionStart = selStartPos + 3;
      evt.currentTarget.selectionEnd = selStartPos + 4;
      evt.preventDefault();

      setContent(value);
    }
  };

  useEffect(() => {
    // update_atInterval();
    // if (last_update + 5000 < Date.now() ){
    // }
  }, [code_lan, content]);

  return (
    <div className="code-edit-container">
      {edit_on ? (
        <div>
          <div className="select-container">
            <select
              value={code_lan}
              onChange={(e) => {
                onChange(e.target.value, content, code_info)
              }}
            >
              {Lan_list.map((option) => (
                <option value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
          <textarea
            className="code-info-input"
            value={code_info}
            onChange={(evt) => onChange(code_lan, content, evt.target.value)}
            onKeyDown={handleKeyDown}
          />
          </div>

          <textarea
            className="code-input"
            value={content}
            onChange={(evt) => onChange(code_lan, evt.target.value, code_info)}
            onKeyDown={handleKeyDown}
          />
          {/* <button onClick={update_atInterval}>save</button> */}
        </div>
      ) : (
        <></>
      )}
      <SyntaxHighlighter
        language={code_lan}
        style={coldarkDark}
        showLineNumbers="true"
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeEditor;
