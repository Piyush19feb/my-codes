export const leetCodeReducer = (state = [], action) => {
  // console.log("Reducer >>  Task_Kist");
  // console.log("Task page List : ", state);
  switch (action.type) {
    case "LEETCODE_PROBLEMS_LIST":
      return action.payload;
    default:
      return state;
  }
};

export const leetCodeFilterReducer = (state = [], action) => {
  
  switch (action.type) {
    case "LEETCODE_PROBLEMS_FILTER_LIST":
      return action.payload;
    default:
      return state;
  }
};
