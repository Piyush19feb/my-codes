export const IsLoggedReducer = (state = false, action) =>{
    console.log("Reducer >>  Logged_in ");
    switch(action.type){
        case 'SIGN_IN' : 
        return true;
        case 'SIGN_OUT' : 
        return false;
        default :
        return state;
    }
}

export const userInfoReducer = (state = null, action) => {    
    console.log("Reducer >>  User_Info ");
    switch(action.type){
        case 'USER_LOGIN_INFO' : 
        return action.payload;
        case 'SIGN_OUT' : 
        return null;
        default :
        return state;
    }
}