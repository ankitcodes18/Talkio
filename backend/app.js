const express = require('express');
const app = express();
const db = require('./config/mongooseConnection');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
const socket = require("socket.io");
const http = require("http");
const { Server } = require("socket.io");
const signupRouter = require('./routes/signupRouter')
const loginRouter = require('./routes/loginRouter')
const getmessageRouter = require('./routes/getmessagesRouter')
const getallusersRouter = require('./routes/getallusersRouter')
const userModel = require('./models/user-model');
const chatModel = require('./models/message-model');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://talkio-phi.vercel.app"],

    methods: ["GET", "POST"],
  },
});
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));
app.use(cookieParser()); 
app.use(cors({
  origin: ["http://localhost:5173", "https://talkio-phi.vercel.app"], 
  credentials: true,               
}));
app.get('/' , (req , res)=>{
    res.send('hii');
})

app.get('/checkAuth', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const user = jwt.verify(token, 'shhhhhhhhhh');
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});
app.get('/logout' , (req , res)=>{
    res.clearCookie("token");
    res.send('logout successfull')
})
app.use('/signup' , signupRouter);
app.use('/login' , loginRouter);
app.use('/getallmessages' , getmessageRouter);
app.use('/getallusers' , getallusersRouter);
app.use('/savemessage' , savemessageRouter);
const onlineusers = {};

async function fetchUsers(){
  try{
    const data = await userModel.find({} , { _id:0 , username :1 , status:1});
    data.forEach((element)=>{
      
      onlineusers[element.username] = null;
        
    })
  }
    catch(err){
      
    }
}
fetchUsers();
io.on("connection" , (uniquesocket)=>{
  
  uniquesocket.on('setUserOnline' , async(user)=>{
    onlineusers[user.username] = uniquesocket.id;
    await userModel.updateOne(
      { username: user.username },
      { $set: { status: "online" } }

    );
    io.emit('allonlineusers' , onlineusers)
    
    
    
  })
  
  uniquesocket.on('sendmessage' ,async (data)=>{

    try{
      
      console.log('sendmessage ke andr hu');
      
      console.log(onlineusers[data.to])
      io.to(onlineusers[data.to]).emit('receivemessage' , {text:data.message ,media:data.media sender:'other'});
      console.log('emit ho gya')

    }
    catch(err){
      console.log(err);
    }
  })
  uniquesocket.on("disconnect", async () => {
    const username = Object.keys(onlineusers).find(
      (name) => onlineusers[name] === uniquesocket.id
    );
    if (username) {
      onlineusers[username] = null;
      await userModel.updateOne(
        { username },
        { $set: { status: "offline", lastSeen: new Date() } }
      );
      io.emit("allonlineusers", onlineusers);
    }
  });
})

server.listen(3000 )