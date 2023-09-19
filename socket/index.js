const io = require('socket.io')(8900, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  console.log('users', users);
  return users.find((user) => user.userId === userId);
};

// when connect
io.on('connection', (socket) => {
  console.log('a user connected');

  //take userId and socketId from user
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });
  // create new group chat
  socket.on('addNewGroup', ({senderId, receiverId, chatCode}) => {
    console.log('addNewGroup', senderId, receiverId, chatCode);
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit('getNewGroup', { senderId, chatCode });
    }
  });

  //send and get message
  socket.on('sendMessage', ({ senderId, receiverId, text, chatCode }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit('getMessage', {
        senderId,
        text,
        chatCode,
      });
    }
  });

  // when disconnect
  socket.on('disconnect', () => {
    console.log('a user disconnected!');
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});
