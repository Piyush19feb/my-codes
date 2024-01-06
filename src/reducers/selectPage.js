const SelectPageReducer = (state = "Leetcode", action) =>{
    // console.log("clicked for page");
    switch(action.type){
        case 'PAGE_SELECTION' : 
            return action.payload;
        default :
            return state;
    }
};

export default SelectPageReducer;