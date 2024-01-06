const IsMenuVisibleReducer = (state = false, action) =>{
    switch(action.type){
        case 'MENU_VISIBLE' : 
            return !state;
        default :
            return state;
    }
};

export default IsMenuVisibleReducer;