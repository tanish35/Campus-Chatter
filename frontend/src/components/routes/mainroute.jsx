import { createBrowserRouter, Navigate } from "react-router-dom";
import { Mainbuttons, Createroom, Joinroom } from "../chatroomui/main";
import Chatroom from "../chatroomui/chatroom";
import { Outlet } from "react-router-dom";
import { chatRoomApi } from "../contexts/chatRoomApi";
import { useState } from "react";
import HomePage from "../../pages/HomePage";
const Test = () => {
  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  return (
    <>
      <chatRoomApi.Provider
        value={{
          userId,
          setUserId,
          targetUserId,
          setTargetUserId,
          roomId,
          setRoomId,
        }}
      >
        <Outlet></Outlet>
      </chatRoomApi.Provider>
    </>
  );
};
// const Header2 = ()=>{
//   const navigate = useNavigate();
//   return(
//     <div>
//       <Header />
//       <Discover />
//       <Services />
//       <Explore />
//       <Testimonials />
//       <Footer />
//     </div>
//   )
// }
const Mainrouter = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/room",
    element: <Test />,
    children: [
      {
        path: "/room",
        element: <Mainbuttons />,
        index: true,
      },
      {
        path: "/room/createroom",
        element: <Createroom />,
      },
      {
        path: "/room/joinroom",
        element: <Joinroom />,
      },
      {
        path: "/room/chatting",
        element: <Chatroom />,
      },
    ],
  },
]);
export default Mainrouter;
