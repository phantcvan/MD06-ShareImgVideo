import { useEffect, useRef, useState } from 'react';
import LeftMenu from './components/LeftMenu';
import { useDispatch, useSelector } from 'react-redux';
import { setPickMenu } from '../../stores/slices/appSlice';
import CreateConversation from './components/CreateConversation';
import Chat from './components/Chat';
import { getCurrentUser } from '../../stores/slices/userSlice';
import { useParams } from 'react-router';
import {
  MiniUserType,
  allMessType,
  createMessType,
  messType,
} from '../../constants/type';
import {
  getAllMessAPI,
  getAllMemberAPI,
  createMessAPI,
} from '../../services/message';
import { io, Socket } from 'socket.io-client';
import MessDetail from './components/MessDetail';
import { getCurrentDate } from '../../constants/fn';
import {
  getArrivalMessage,
  getNewMessages,
  setArrivalMessage,
  setNewGroupCode,
  setNewMessages,
} from '../../stores/slices/messageSlice';

const Message = () => {
  const dispatch = useDispatch();
  const [openSendMess, setOpenSendMess] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [createdGroup, setCreatedGroup] = useState(false);
  const [deletedChat, setDeletedChat] = useState(false);
  const currentUser = useSelector(getCurrentUser);
  const pathname = useParams();
  const groupCode = pathname.chatCode || '';
  const [conversation, setConversation] = useState<allMessType[]>([]);
  const [memberWithoutMe, setMemberWithoutMe] = useState<MiniUserType[]>([]);
  const newMessages = useSelector(getNewMessages);
  // const [newMessages, setNewMessages] = useState<allMessType[]>([]);
  // const [newMessage, setNewMessage] = useState(false);
  // const [newGroupCode, setNewGroupCode] = useState('');
  const arrivalMessage = useSelector(getArrivalMessage);
  // const [arrivalMessage, setArrivalMessage] = useState<messType | null>(null);
  const socket = useRef<Socket | null>(null);
  const [input, setInput] = useState('');
  const [deleteGroup, setDeleteGroup] = useState<string>('');

  const fetchMess = async () => {
    const messResponse: any = await getAllMessAPI(groupCode, currentUser?.id);
    const usersResponse: any = await getAllMemberAPI(groupCode);
    const { status, messFilter } = messResponse;
    if (status === 200) {
      setConversation(messFilter);
    } else {
      setConversation([]);
    }
    if (usersResponse?.status === 200) {
      const membersList: MiniUserType[] = [];
      usersResponse?.group?.members?.forEach((fr: any) => {
        if (!membersList.some((unique) => unique.id === fr.id)) {
          membersList.push(fr);
        }
      });
      const memberFilter = membersList.filter(
        (mb) => mb.id !== currentUser?.id
      );
      setMemberWithoutMe(memberFilter);
    }
  };
  // update title
  const updateTitle = () => {
    document.title = 'Instagram ・ Chats';
  };
  // tải dữ liệu Message
  useEffect(() => {
    fetchMess();
  }, [currentUser, groupCode, createdGroup, deletedChat, arrivalMessage]);

  // Thay đổi title của trang và set Pick
  useEffect(() => {
    dispatch(setPickMenu('messages_sb'));
    updateTitle();
  }, []);

  // gửi tin nhắn khi enter
  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    mess: string
  ) => {
    if (e.keyCode === 13 && mess) {
      const newMess: createMessType = {
        group_code: groupCode,
        user_id: currentUser?.id,
        mess,
      };
      const response: any = await createMessAPI(newMess);
      if (response.status === 201) {
        memberWithoutMe.map((member) =>
          socket?.current?.emit('sendMessage', {
            senderId: currentUser.id,
            receiverId: member.id,
            text: mess,
            chatCode: groupCode,
          })
        );
        const date = getCurrentDate();
        const newMessageArrival = {
          id: Math.floor(Math.random() * -10000000000),
          mess,
          date,
          user: currentUser,
          converCode: groupCode,
        };
        const newMess = [...newMessages, newMessageArrival];
        dispatch(setNewMessages(newMess));
        setInput('');
        let newDeleteGroup = '';
        const deleteArr = deleteGroup.split(', ');
        if (deleteArr.includes(`${groupCode}`)) {
          newDeleteGroup = deleteArr
            .filter((arr) => arr.trim() !== groupCode)
            .join(', ');
          setDeleteGroup(newDeleteGroup);
        }
      }
    }
  };

  // SOCKET IO

  // SOCKET IO
  useEffect(() => {
    if (
      arrivalMessage &&
      conversation.some((mess) => mess.user.id === arrivalMessage.send_id)
    ) {
      const sendInfo = memberWithoutMe.filter(
        (mb) => mb.id === arrivalMessage.send_id
      )[0];
      const date = arrivalMessage.date;
      const newMessageArrival = {
        id: Math.floor(Math.random() * -10000000000),
        mess: arrivalMessage.mess,
        date,
        user: sendInfo,
        converCode: groupCode,
      };
      dispatch(setNewMessages([...newMessages, newMessageArrival]));
    }
  }, [arrivalMessage, conversation]);
  useEffect(() => {
    dispatch(setNewMessages([]));
  }, [conversation]);
  useEffect(() => {
    socket.current = io('ws://localhost:8900');
    socket.current.on('getMessage', (data) => {
      dispatch(setNewGroupCode(data?.chatCode));
      const date = getCurrentDate();
      dispatch(
        setArrivalMessage({
          send_id: data.senderId,
          mess: data.text,
          date,
          converCode: data.chatCode,
        })
      );
    });
    if (socket.current) {
      socket?.current.emit('addUser', currentUser?.id);
      socket?.current.on('getUsers', (users) => {
        // setOnlineUsers(
        //   user.followings.filter((f) => users.some((u) => u.userId === f))
        // );
      });
    }
  }, [currentUser]);

  // useEffect(() => {
  //   dispatch(setNewMessages([]));
  // }, [conversation]);
  // useEffect(() => {
  //   socket.current = io('ws://localhost:8900');
  //   socket.current.on('getMessage', (data) => {
  //     console.log('newData MESS', data);
  //     dispatch(setNewGroupCode(data?.chatCode));
  //     const date = getCurrentDate();

  //     const newArrival = {
  //       send_id: data.senderId,
  //       mess: data.text,
  //       date,
  //       converCode: data.chatCode,
  //     };
  //     dispatch(setArrivalMessage(newArrival));
  //   });
  //   if (socket.current) {
  //     socket?.current.emit('addUser', currentUser?.id);
  //     socket?.current.on('getUsers', (users) => {
  //       // setOnlineUsers(
  //       //   user.followings.filter((f) => users.some((u) => u.userId === f))
  //       // );
  //     });
  //   }
  // }, [currentUser]);

  // useEffect(() => {
  //   if (
  //     arrivalMessage &&
  //     conversation.some((mess) => mess.user.id === arrivalMessage.send_id)
  //   ) {
  //     const sendInfo = memberWithoutMe.filter(
  //       (mb) => mb.id === arrivalMessage.send_id
  //     )[0];
  //     const date = arrivalMessage.date;
  //     const newMessageArrival = {
  //       id: Math.floor(Math.random() * -10000000000),
  //       mess: arrivalMessage.mess,
  //       date,
  //       user: sendInfo,
  //       converCode: groupCode,
  //     };
  //     const newMess = [...newMessages, newMessageArrival];
  //     dispatch(setNewMessages(newMess));
  //   }
  // }, [arrivalMessage, conversation]);

  console.log('arrivalMessage', arrivalMessage);
  console.log('newMessages', newMessages);

  return (
    <div className='flex flex-row max-h-screen max-w-screen hide-scrollbar-x w-[100%]'>
      <div className='hidden md:flex-1 md:min-h-[300px] md:inline-flex'>
        <LeftMenu
          setOpenSendMess={setOpenSendMess}
          createdGroup={createdGroup}
          newMessages={newMessages}
          deletedChat={deletedChat}
          deleteGroup={deleteGroup}
          setDeleteGroup={setDeleteGroup}
        />
      </div>
      <div className='md:flex-3 sm:flex'>
        <Chat
          setShowEdit={setShowEdit}
          showEdit={showEdit}
          memberWithoutMe={memberWithoutMe}
          conversation={conversation}
          handleKeyDown={handleKeyDown}
          newMessages={newMessages}
          input={input}
          setInput={setInput}
        />
      </div>
      {showEdit && (
        <MessDetail
          memberWithoutMe={memberWithoutMe}
          setDeletedChat={setDeletedChat}
          setDeleteGroup={setDeleteGroup}
          deleteGroup={deleteGroup}
        />
      )}
      {openSendMess && (
        <CreateConversation
          setOpenSendMess={setOpenSendMess}
          setCreatedGroup={setCreatedGroup}
        />
      )}
    </div>
  );
};

export default Message;
