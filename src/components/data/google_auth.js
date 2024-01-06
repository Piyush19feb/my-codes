// import React, { useState, useEffect } from "react";
// import { GoogleLogin, GoogleLogout } from 'react-google-login';
// import {REACT_APP_CLIENT_ID} from process.env;


// const CLIENT_ID = REACT_APP_CLIENT_ID;



// import {
//   GoogleOAuthProvider,
//   googleLogout,
//   GoogleLogin,
// } from "@react-oauth/google";
// import jwt_decode from "jwt-decode";

// import { Login, vinanti } from "../data/data";


// export const LoginTab = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [user_name, setUser_name] = useState("Guest");
//   const [img_url, setImg_url] = useState(
//     "https://www.flaticon.com/premium-icon/guests_3044552",
//   );

//   const toggleCollapse = () => {
//     setIsOpen(!isOpen);
//   };

//   const onSignIn = (googleUser) => {
//     const userObject = jwt_decode(googleUser.credential);
//     localStorage.setItem("user", JSON.stringify(userObject));
//     const { name, sub, picture, email } = userObject;
//     setImg_url(picture);
//     setUser_name(name);
//     // login to admin io with google credits
//     Login({ name, sub, picture, email }).then(async (data) => {
//       dispatch(toggleLogin(true)); // this.setState({ loggedIn: true });
//       props.data.loggedIn(true);
//       var payload = {
//         user_id: sub,
//         img_url: picture,
//         user_name: name,
//         user_email: email,
//         auth_token: data.data["auth-token"],
//       };

//       dispatch(userInfo(payload));

//       var meta_data = await vinanti("", "metadata", payload.auth_token, {
//         email: payload.user_email,
//       });

//       dispatch(
//         StateUpdateAction(
//           "META_DATA",
//           meta_data && meta_data.length > 0 ? meta_data[0] : null,
//         ),
//       );

//       var custom_setts = await vinanti("list", "custom", payload.auth_token, {
//         email: payload.user_email,
//       });
//       dispatch(updateCustomSettings(custom_setts?.[0]));

//       // let tasks = await vinanti("list", "task", payload.auth_token, {
//       //   email: payload.user_email,
//       // });
//       // dispatch(updateTasksList(tasks));
//     });
//   };

//   const signOut = () => {
//     localStorage.setItem("user", null);
//     dispatch(toggleLogin(false)); // this.setState({ loggedIn: true });
//     googleLogout();
//   };

//   useEffect(() => {}, []);

//   return (
//     <>
//       {loggedIn ? (
//         <>
//           <div
//             style={{ display: "flex", cursor: "pointer", height: "40px" }}
//             onClick={toggleCollapse}
//           >
//             <img
//               src={img_url}
//               style={{ height: "40px", padding: 0, borderRadius: "50%" }}
//               alt=""
//             />
//             <div
//               className="hidden md:visible lg:flex"
//               style={{ padding: "10px 10px", color: "white" }}
//             >
//               {user_name}
//             </div>
//           </div>
//           {isOpen ? (
//             <div className="Glogout">
//               <Button text="Logout" onclick={signOut} />
//             </div>
//           ) : (
//             <></>
//           )}
//         </>
//       ) : (
//         <GoogleOAuthProvider clientId={`${CLIENT_ID}`}>
//           <GoogleLogin
//             onSuccess={onSignIn}
//             onFailure={signOut}
//             cookiePolicy="single_host_origin"
//             auto_select={true}
//             theme="filled_black"
//             text="continue_with"
//             useOneTap={true}
//             // size="medium"
//           />
//         </GoogleOAuthProvider>
//       )}
//     </>
//   );
// };


// class GoogleBtn extends Component {
//    constructor(props) {
//     super(props);

//     this.state = {
//       isLogined: false,
//       accessToken: ''
//     };

//     this.login = this.login.bind(this);
//     this.handleLoginFailure = this.handleLoginFailure.bind(this);
//     this.logout = this.logout.bind(this);
//     this.handleLogoutFailure = this.handleLogoutFailure.bind(this);
//   }

//   login (response) {
//     if(response.accessToken){
//       this.setState(state => ({
//         isLogined: true,
//         accessToken: response.accessToken
//       }));
//     }
//   }

//   logout (response) {
//     this.setState(state => ({
//       isLogined: false,
//       accessToken: ''
//     }));
//   }

//   handleLoginFailure (response) {
//     alert('Failed to log in')
//   }

//   handleLogoutFailure (response) {
//     alert('Failed to log out')
//   }

//   render() {
//     return (
//     <div>
//       { this.state.isLogined ?
//         <GoogleLogout
//           clientId={ CLIENT_ID }
//           buttonText='Logout'
//           onLogoutSuccess={ this.logout }
//           onFailure={ this.handleLogoutFailure }
//         >
//         </GoogleLogout>: <GoogleLogin
//           clientId={ CLIENT_ID }
//           buttonText='Login'
//           onSuccess={ this.login }
//           onFailure={ this.handleLoginFailure }
//           cookiePolicy={ 'single_host_origin' }
//           responseType='code,token'
//         />
//       }
//       { this.state.accessToken ? <h5>Your Access Token: <br/><br/> { this.state.accessToken }</h5> : null }

//     </div>
//     )
//   }
// }

// export default GoogleBtn;