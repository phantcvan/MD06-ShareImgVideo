import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../views/home/Home';
import PrivateRoute from './PrivateRoute';
import Login from '../views/login/Login';
import { PATH } from '../services/list-path';
import Register from '../views/register/Register';
import Explore from '../views/explore/Explore';
import Profile from '../views/profile/Profile';
import Message from '../views/message/Message';
import Inbox from '../views/message/Inbox';
import EditProfile from '../views/profile/EditProfile';
import Admin from '../views/admin/Admin';
import Messenger from '../views/messenger/Messenger';
import { useState } from 'react';
// import Chat from '../views/messenger/Chat';
// import Inbox from '../views/messenger/Inbox';

const Routers = () => {
  const [openSendMess, setOpenSendMess] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATH.PRIVATE} element={<PrivateRoute />}>
          <Route path={PATH.HOME} element={<Home />} />
          <Route path={PATH.EXPLORE} element={<Explore />} />
          {/* <Route
            path={PATH.MESSENGER}
            element={
              <Messenger
                openSendMess={openSendMess}
                setOpenSendMess={setOpenSendMess}
              />
            }
          >
            <Route
              path={PATH.INBOX}
              element={
                <Inbox
                  setOpenSendMess={setOpenSendMess}
                  openSendMess={openSendMess}
                />
              }
            /> */}
            {/* <Route path={PATH.MESSAGE} element={<Chat />} /> */}
          {/* </Route> */}
            <Route path={PATH.MESSAGE} element={<Message />} />
            <Route path={PATH.INBOX} element={<Inbox />} />
          <Route path={PATH.PROFILE} element={<Profile />} />
          <Route path={PATH.EDITPROFILE} element={<EditProfile />} />
          <Route path={PATH.ADMIN} element={<Admin />} />
          <Route path={PATH.STAR} element={<Home />} />
        </Route>

        <Route path={PATH.LOGIN} element={<Login />} />
        <Route path={PATH.REGISTER} element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
