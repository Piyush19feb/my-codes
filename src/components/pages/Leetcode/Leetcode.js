import React, { useState } from "react";
import { useEffect } from "react";
import "./leetcode.css";
import {
  newLeetcode,
  leetcodeList,
  updateLeetcode,
  deleteLeetcode,
} from "../../data/data";
import { useDispatch, useSelector } from "react-redux";
// import { useSelector } from "react-redux";
// import { updateLeetcodeProblemsList, updateProjectsList } from "../../../actions";
import Modal from "./modal";
import { selectPage } from "../../../actions";
import { updateLeetcodeList, updateLeetcodeSearchList } from "../../../actions";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import CodeEditor from "./textEditor";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  Modifier,
  getDefaultKeyBinding,
  DefaultDraftBlockRenderMap,
} from "draft-js";
import "draft-js/dist/Draft.css";

export function Leetcode(props) {
  const [Leetcode_Problem_id, setLeetcode_Problem_id] = useState("Sr. no");
  const [Leetcode_Problem_name, setLeetcode_Problem_name] = useState(
    "New Leetcode_Problem"
  );
  const [Leetcode_Search, setLeetcode_Search] = useState("#Search");
  const [Leetcode_Problem_details, setLeetcode_Problem_details] =
    useState("None");
  const [Leetcode_Problem_solns, setLeetcode_Problem_solns] = useState([]);
  const [Leetcode_Problem_visits, setLeetcode_Problem_visits] = useState([]);
  const [Leetcode_Problem_futureRef, setLeetcode_Problem_futureRef] = useState(
    []
  );
  const [Leetcode_Problem_Tags, setLeetcode_Problem_Tags] = useState([]);
  const [Leetcode_Problem_level, setLeetcode_Problem_level] = useState("Easy");

  const [problem_info_on, setProblem_info_on] = useState(null);

  const [problem_des_on, setProblem_des_on] = useState([false, null]);
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );

  const [problem_soln_on, setProblem_soln_on] = useState(null);
  const [problem_soln_edit, setProblem_soln_edit] = useState([
    false,
    null,
    null,
  ]);
  const [codestate, setCodestate] = useState({
    lan: "c++",
    code: "Template Code",
    info: "no info here",
  });

  // const [list, setList] = useState([]);
  const raw_data = useSelector((state) => state.leetcode_page_problems);
  var list =  useSelector((state) => state.leetcode_page_problems_filtered);
  const user_info = useSelector((state) => state.user_info);

  const [Count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [delModel, setDelModel] = useState(false);
  const [currDel, setCurrDel] = useState(null);
  const dispatch = useDispatch();

  const get_problems_List = async () => {
    if (user_info) {
      setBusy(true);

      var data = await leetcodeList(user_info.auth_token, user_info.user_email);

      console.log("problems List ", data);
      setBusy(false);
      dispatch(updateLeetcodeList(data));
      dispatch(updateLeetcodeSearchList(data));
    }
  };

  const update_search = async () => {
    setBusy(true);

    const data = raw_data;
    var res = [];

    if ((Leetcode_Search == "") | (Leetcode_Search == "#Search")) {
      res = data;
      console.log("woking..",data);
    } else {
      for (let i = 0; i < data.length; i++) {
        let rgx = new RegExp(Leetcode_Search.toLowerCase());
        let j_data = JSON.stringify(data[i]).toLowerCase();
        const isMatch = j_data.match(rgx) || [];
        // console.log("is match ",isMatch.length);
        if (isMatch.length !== 0) {
          res.push(data[i]);
        }
      }
    }

    dispatch(updateLeetcodeSearchList(res));
    list = res;
    console.log("res : ", res.length);
    setBusy(false);
  };
  const setCurrent_Active = (d, i) => {
    if (problem_info_on === i) {
      setProblem_info_on(null);
      setEditorState(EditorState.createEmpty());
    } else {
      setProblem_info_on(i);
      setEditorState(EditorState.createEmpty());
      let dummy = d.problem_description;
      if (dummy[0] === "{") {
        //the json is ok
        console.log("Json Ok", dummy);
        const rawEditorData = JSON.parse(dummy);
        if (rawEditorData !== null) {
          const contentState = convertFromRaw(rawEditorData);
          setEditorState(EditorState.createWithContent(contentState));
        }
      } else {
        //the json is not ok
        let contentState = editorState.getCurrentContent();
        let targetRange = editorState.getSelection();
        let newContentState = Modifier.insertText(
          contentState,
          targetRange,
          dummy
        );
        setEditorState(EditorState.createWithContent(newContentState));
        // console.log("Dummy", newContentState);
      }

      // setCodestate(d.solutions[0]);
      // setProblem_soln_on(0);
      setCurrent_Active_soln(d.solutions[0], 0);
    }
  };
  const setCurrent_Active_soln = (d, i, toggle = false) => {
    setProblem_soln_on(i);
    setCodestate(d);
    setProblem_soln_edit([toggle, problem_info_on, i]);
  };
  const newProblem_submit = async () => {
    setBusy(true);
    await newLeetcode(
      user_info.auth_token,
      Leetcode_Problem_id,
      Leetcode_Problem_name,
      user_info.user_email,
      Leetcode_Problem_level,
      Leetcode_Problem_Tags
    );
    setLeetcode_Problem_id("Sr. no.");
    setLeetcode_Problem_name("New Problem");
    setLeetcode_Problem_level("Easy");
    setLeetcode_Problem_Tags([]);
    get_problems_List();
    setBusy(false);
  };
  const newBlankSolution = async (leetcode, i) => {
    let blank = { lan: "None", code: "No Code Here" };
    let si = list[i].solutions.length;
    list[i].solutions.splice(si, 0, blank);
    setProblem_soln_edit([true, i, si]);
    setCurrent_Active_soln(blank, si, true);
    // setProblem_soln_on(list[i].solutions.length);
  };
  const updateProblem_description = async (leetcode, i) => {
    const raw = convertToRaw(editorState.getCurrentContent());
    const raw_data = JSON.stringify(raw);
    delete leetcode["problem_description"];
    leetcode["problem_description"] = raw_data;
    list[i].problem_description = raw_data;
    setBusy(true);
    await updateLeetcode(leetcode, user_info.auth_token);
    setBusy(false);
    dispatch(updateLeetcodeList(list));
    refresh(); //Since List not updating on time this is added temp
    setProblem_des_on([false, i]);
    console.log("description Updated Success.");
  };
  const updateSolution = async (leetcode, i) => {
    let si = problem_soln_on;
    leetcode.solutions.splice(si, 1, codestate);
    list[i] = leetcode;

    setBusy(true);
    await updateLeetcode(leetcode, user_info.auth_token);
    setBusy(false);
    dispatch(updateLeetcodeList(list));
    refresh(); //Since List not updating on time this is added temp
    setProblem_soln_edit([false, i, si]);
    console.log("description Updated Success.", leetcode);
  };
  const del_Solution = async (leetcode, i) => {
    let si = problem_soln_on;
    leetcode.solutions.splice(si, 1);
    list[i] = leetcode;

    setBusy(true);
    await updateLeetcode(leetcode, user_info.auth_token);
    setBusy(false);
    dispatch(updateLeetcodeList(list));
    refresh(); //Since List not updating on time this is added temp
    setProblem_soln_edit(false);
    console.log("delete soln Updated Success.", leetcode);
  };
  const refresh = () => {
    setCount(Count + 1);
    // setIcon(icon === "done" ? "pending_actions" : "done");
  };

  const leetcode_delete = async () => {
    console.log(currDel, " topic sent for delete Final Operation.");
    setDelModel(false);
    await deleteLeetcode(currDel, user_info.auth_token, user_info.user_email);
    setCurrDel(null);
    // console
    get_problems_List();
    // refresh();
  };
  const openModal = (task, i) => {
    console.log(task, " wants to get deleted.");
    setDelModel(true);
    setCurrDel(list[i]._id);
  };
  const closeOpenModal = () => {
    console.log("modal closed");
    setDelModel(false);
  };
  // const subTask_ = (i) => {

  // }
  useEffect(() => {
    console.log("UseEffect Triggered..!");
    // setBusy(true);
    // get_tasks_List();
    // setBusy(false);
    get_problems_List();
  }, [user_info]);

  useEffect(() => {
    console.log("UseEffect Triggered..! for new search..");
    update_search();
  }, [Leetcode_Search]);

  const get_date = (date) => {
    var data = new Date(date);
    var options = { weekday: "short", month: "short", day: "numeric" };
    // console.log(data.toLocaleDateString('en-US', options));
    return data.toLocaleDateString("en-US", options);
  };
  const get_date_diff = (date) => {
    var today = Date.now();
    var data = new Date(date);
    // get total seconds between the times
    var delta = Math.abs(today - data) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    // var options = { weekday: "short", month: "short", day: "numeric" };
    // console.log(data.toLocaleDateString('en-US', options));
    return days + " Days ago";
  };

  return (
    <>
      {console.log("Rederered.",list, Leetcode_Search)}
      {/* <div className="Tasks-Card-wrapper"> */}
      <div className="leetcode">
        <div className="leetcode-body">
          <div class="leetcode-container m-3">
            <div class="row">
              <div class="col-md-12">
                <div class="align-items-center">
                  <div className="leetcode-header">
                    <div>
                      <span class="leetcode-header">Leetcode Problems</span>
                    </div>
                  </div>
                  <div className="leetcode-tools">
                    <div className="leetcode-new-problem-add">
                      <div id="problem-no" className="leetcode-input-style">
                        <input
                          title="no."
                          type="text"
                          value={Leetcode_Problem_id}
                          onChange={(e) =>
                            setLeetcode_Problem_id(e.target.value)
                          }
                        />
                      </div>
                      <div id="problem-title" className="leetcode-input-style">
                        <input
                          title="Problem"
                          type="text"
                          placeholder="Enter New Problem Name"
                          value={Leetcode_Problem_name}
                          onChange={(e) =>
                            setLeetcode_Problem_name(e.target.value)
                          }
                        />
                      </div>
                      <div className="leetcode-input-style">
                        <input
                          title="Level"
                          type="text"
                          value={Leetcode_Problem_level}
                          onChange={(e) =>
                            setLeetcode_Problem_level(e.target.value)
                          }
                        />
                      </div>
                      <div className="leetcode-input-style">
                        <input
                          title="tags"
                          type="text"
                          value={Leetcode_Problem_Tags}
                          onChange={(e) =>
                            setLeetcode_Problem_Tags(e.target.value.split(","))
                          }
                        />
                      </div>
                      <button
                        type="button"
                        className="btn-sm btn-outline-success"
                        onClick={() => newProblem_submit()}
                      >
                        Create New
                      </button>
                    </div>
                    <div className="leetcode-tool-buttons">
                      <div className="leetcode-search">
                        <div
                          id="problem-search-box"
                          className="leetcode-input-style"
                        >
                          <input
                            title="Search"
                            type="text"
                            value={Leetcode_Search}
                            onChange={(e) => setLeetcode_Search(e.target.value)}
                          />
                        </div>
                        <button
                          type="button"
                          className="btn-sm btn-outline-success"
                          // onClick={() => newProblem_submit()}
                        >
                          Search
                        </button>
                      </div>
                      <button
                        type="button"
                        className="btn-sm btn-outline-success"
                        onClick={() => get_problems_List()}
                      >
                        Get Problems
                      </button>
                      <button
                        type="button"
                        className="btn-sm btn-outline-success"
                        // onClick={() => refresh()}
                      >
                        No. of Q : {list ? list.length : 0}
                      </button>
                      <button
                        type="button"
                        className={
                          busy
                            ? "btn-sm btn-outline-danger"
                            : "btn-sm btn-outline-success"
                        }
                        // onClick={() => refresh()}
                      >
                        {busy ? "Busy" : "Idel"}
                      </button>
                    </div>
                  </div>
                  <br />
                </div>
                <div class="mt-3">
                  {/* <nav aria-label="Page navigation example">
                    <ul class="pagination">
                      <li class="page-item">
                        <a class="page-link" href="#" aria-label="Previous">
                          <span aria-hidden="true">&laquo;</span>
                          <span class="sr-only">Previous</span>
                        </a>
                      </li>
                      <li class="page-item">
                        <a class="page-link" href="#">
                          1
                        </a>
                      </li>
                      
                      <li class="page-item">
                        <a class="page-link" href="#" aria-label="Next">
                          <span aria-hidden="true">&raquo;</span>
                          <span class="sr-only">Next</span>
                        </a>
                      </li>
                    </ul>
                  </nav> */}
                  <ul class="list list-inline">
                    {list.length !== 0 ? (
                      list.map((d, i) => (
                        <li className="list-group-item">
                          <div className="problem-wrapper row">
                            <div
                              className="problem-info-inline"
                              onClick={() => setCurrent_Active(d, i)}
                            >
                              <div className="task-name">
                                {/* <i
                                class="material-icons"
                                onClick={() => task_checkbox_submit(d, i)}
                              >
                                {d.status ? "done" : "check_box_outline_blank"}
                              </i> */}
                                <label className="form-check-label">
                                  <h6 class="mb-0">
                                    {d.problem_no + ". " + d.problem_title}
                                  </h6>
                                </label>
                              </div>
                              <div className="task-tags">
                                {/* <div className="task-tag" onClick={()=> setProblem_info_on(i)}>
                              <i className="material-icons">add</i>
                              </div> */}
                                <div className="task-tag">
                                  <span class="badge bg-danger">
                                    {get_date_diff(d.future_ref)}
                                  </span>
                                </div>
                                <div className="task-tag">
                                  {d.level == "Easy" ? (
                                    <span class="badge bg-success">
                                      {d.level}
                                    </span>
                                  ) : d.level == "Medium" ? (
                                    <span class="badge bg-info">{d.level}</span>
                                  ) : (
                                    <span class="badge bg-danger">
                                      {d.level}
                                    </span>
                                  )}
                                </div>
                                <div className="task-tag">
                                  <span class="badge bg-secondary">
                                    {d.tags}
                                  </span>
                                </div>

                                <div className="task-tag">
                                  <span onClick={() => openModal(d, i)}>
                                    <i className="material-icons">delete</i>
                                  </span>
                                </div>
                              </div>
                            </div>
                            {problem_info_on === i ? (
                              <div
                                className={
                                  problem_info_on === i
                                    ? "leetcode-problem_info-active "
                                    : "leetcode-problem_info-block "
                                }
                              >
                                <div className="problem-info-details">
                                  {(problem_des_on[1] === problem_info_on) &
                                  problem_des_on[0] ? (
                                    // MyEditor(d.problem_description)
                                    <div>
                                      <div className="editor_local">
                                        <Editor
                                          editorState={editorState}
                                          onChange={setEditorState}
                                        />
                                      </div>
                                      <button
                                        onClick={() =>
                                          // setProblem_des_on([true, i])
                                          updateProblem_description(d, i)
                                        }
                                      >
                                        Save
                                      </button>
                                    </div>
                                  ) : (
                                    <div>
                                      <div className="editor_local">
                                        <Editor
                                          // editorState={editorState}
                                          editorState={editorState}
                                          // onChange={setEditorState}
                                          readOnly={true}
                                        />
                                      </div>
                                      {/* <SyntaxHighlighter
                                      language="javascript"
                                      style={docco}
                                      showLineNumbers="false"
                                    >
                                      {d.problem_description}
                                    </SyntaxHighlighter> */}
                                      <button
                                        onClick={() =>
                                          setProblem_des_on([true, i])
                                        }
                                      >
                                        Update
                                      </button>
                                    </div>
                                  )}
                                  {/* {d.problem_description} */}
                                </div>
                                <div className="problem-solutions">
                                  {/* <div className="problem_info-adder">
                              <input
                              title="Sub-task"
                              type="text"
                              placeholder="Enter New Sub Task"
                              value={task_name}
                              onChange={(e) => setTask_name(e.target.value)}
                              />
                              <button
                              type="button"
                              className="btn-sm btn-outline-success"
                              onClick={() => newproblem_info_submit(d)}
                              >
                              Add Sub Task
                              </button>
                              <button onClick={() => setproblem_info_on(null)}>
                              close
                              </button>
                            </div> */}
                                  <div className="problem-solutions-array">
                                    <li class="dropdown">
                                      <div
                                        class="dropdown-toggle btn btn-secondary btn-sm"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        {codestate.lan + " | " + codestate.info}
                                      </div>
                                      <ul class="dropdown-menu">
                                        {d.solutions ? (
                                          d.solutions.map((s, si) => (
                                            <>
                                              <li
                                                className="dropdown-item"
                                                onClick={() =>
                                                  setCurrent_Active_soln(s, si)
                                                }
                                              >
                                                {s.lan + " | " + s.info}
                                              </li>
                                            </>
                                          ))
                                        ) : (
                                          <a class="dropdown-item">
                                            No Solutions Available
                                          </a>
                                        )}
                                      </ul>
                                      <button
                                        className="problem-solution-adder"
                                        onClick={() => {
                                          newBlankSolution(d, i);
                                        }}
                                      >
                                        +
                                      </button>
                                      {problem_soln_edit[0] ? (
                                        <button
                                          onClick={() => updateSolution(d, i)}
                                        >
                                          save
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() =>
                                            setProblem_soln_edit([
                                              true,
                                              problem_info_on,
                                              problem_soln_on,
                                            ])
                                          }
                                        >
                                          Update
                                        </button>
                                      )}
                                      <button
                                        className="problem-solution-adder"
                                        onClick={() => {
                                          del_Solution(d, i);
                                        }}
                                      >
                                        <i className="material-icons">delete</i>
                                      </button>
                                    </li>
                                  </div>
                                  <div className="problem-solution-selected">
                                    {!problem_soln_edit[0] ? (
                                      <SyntaxHighlighter
                                        language={codestate.lan}
                                        style={coldarkDark}
                                        showLineNumbers="true"
                                      >
                                        {codestate.code}
                                      </SyntaxHighlighter>
                                    ) : (
                                      // <CodeEditor data={codestate} onChange={setCodestate} viewOnly={true} />
                                      <div>
                                        <CodeEditor
                                          data={codestate}
                                          onChange={setCodestate}
                                          viewOnly={true}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item">No Data Found -_-</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <Modal
            show={delModel}
            handleClose={() => closeOpenModal()}
            handleConfirm={() => leetcode_delete()}
          >
            <div style={{ display: "inline" }}>
              <h5>Do you Want To Delete </h5>{" "}
              <h3>
                <b>{currDel}</b>
              </h3>{" "}
              <h5>Problem ?</h5>{" "}
            </div>
          </Modal>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}
