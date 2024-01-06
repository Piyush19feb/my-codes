// // component To export json data
import axios from "axios";

const { REACT_APP_BACKEND_SITE } = process.env;
// const site = REACT_APP_BACKEND_SITE;

const site = "http://localhost:4000/";

const backend_addresses = {
  login: site + "auth/login",
  search_query: site + ".netlify/functions/server/search/query",

  new_leetcode_add: site + "leetcode/new",
  leetcode_list: site + "leetcode/list",
  leetcode_del: site + "leetcode/del",
  leetcode_update: site + "leetcode/update",
};

const newLeetcode = async (
  token,
  problem_no,
  problem_title,
  user,
  level,
  tags
) => {
  var data = {
    problem_no: problem_no,
    email: user,
    problem_title: problem_title,
    level: level,
    tags: tags,
  };
  // console.log("here for process.:", token, data);
  const res = await axios
    .post(backend_addresses.new_leetcode_add, data, {
      headers: {
        "auth-token": token,
      },
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
    });
  // console.log("from data js ",res);
  return res;
};

const leetcodeList = async (token, user) => {
  var data = {
    email: user,
  };
  // console.log("Task List .:", token, data);
  const res = await axios
    .post(backend_addresses.leetcode_list, data, {
      headers: {
        "auth-token": token,
      },
    })
    .then((res) => {
      // console.log('new topic sent',res);
      return res ? res : null;
    })
    .catch((err) => {
      console.error(err);
    });
  // console.log("Task List :  ", res.data);
  return res ? res.data : null;
};

const Login = async ({ sub, name, email, picture }) => {
  const res = await axios.post(backend_addresses.login, {
    google_id: sub,
    name,
    email,
    img_url: picture,
  });
  console.log(" Data >> Login >> ", res.data.login);
  return res;
};

const updateLeetcode = async (Leetcode, token) => {
  const res = await axios
    .post(
      backend_addresses.leetcode_update,
      { updated_info: Leetcode },
      {
        headers: {
          "auth-token": token,
        },
      }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
    });
  console.log("Update Res :  ", res);
  return res.data;
};

const deleteLeetcode = async (leetcode_id, token, user) => {
  const res = await axios
    .post(
      backend_addresses.leetcode_del,
      { leetcode_id: leetcode_id, user: user },
      {
        headers: {
          "auth-token": token,
        },
      }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
    });
  console.log("Deletion Res :  ", res);
  return res.data;
};

const searchQuery = async (user, query, token) => {
  let res = await axios.post(
    backend_addresses.search_query,
    { user: user, query: query },
    {
      headers: {
        "auth-token": token,
      },
    }
  );
  console.log("search q => ", res.data);
  return res.data;
};

export {
  Login,
  searchQuery,
  leetcodeList,
  newLeetcode,
  deleteLeetcode,
  updateLeetcode,
};
