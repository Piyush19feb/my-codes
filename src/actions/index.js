export const toggleLogin = (payload) => {
  return payload ? { type: "SIGN_IN" } : { type: "SIGN_OUT" };
};

export const userInfo = (payload) => {
  return {
    payload: payload,
    type: "USER_LOGIN_INFO",
  };
};

export const toggleBuzy = () => {
  return {
    type: "Buzy",
  };
};
export const selectPage = (payload) => {
  return {
    type: "PAGE_SELECTION",
    payload: payload,
  };
};

export const updateLeetcodeList = (payload) => {
  return {
    type: " ",
    payload : payload
  };
};
export const updateLeetcodeSearchList = (payload) => {
  return {
    type: "LEETCODE_PROBLEMS_FILTER_LIST",
    // type: "LEETCODE_PROBLEMS_LIST",
    payload : payload
  };
};
