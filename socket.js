const express = require("express");
const http = require("http");
const { adduser, permissiontousers, removeUser, getUser, getUsersInRoom, getUserbymail, togglepermission, updaterole } = require("./users");
const mongoose = require('mongoose');
// const { profile } = require("console");
const app = express();
const server = http.createServer(app);
const user = []
// const Chat = require('./schema')
// let roomm;

io = require('socket.io')(server,{
    cors : {
    origin :"*",
    methods: ["GET", "POST"],
    credentials: true
    }
});
app.use(require('cors'))


const db = mongoose.connect('mongodb+srv://sanjay123:sanjay123@cluster0.4xqjv.mongodb.net/test',(err)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("connected Succesfully");
        }
});

var chatschema = mongoose.Schema({
    user : String,
    text : String,
    created : String,
    email : String,
    file : String,
    profile : String
});
        var Chat;


io.sockets.on("connect", (socket) => {
    console.log("socket connected");
    socket.on('join', ({room,name,role,email,profile}) =>
    {
        // CAll back edited
        // ,callback
        console.log("inside join emit",name,room,role)
        const { error , user } = adduser({id : socket.id ,name : name ,room : room,handrise : false,permission : false,emailOrphone : email,audio : false, video : false, usertype : role,profile : profile})
        Chat = mongoose.model(room,chatschema)

    
        Chat.find({},function(err,docs){
            if(err)
            {
                throw err;
            }
            else
            {
                socket.emit('loadmsg',docs);
            }
        })
        if(error) return callback(error)
        
        else{
        if(name){
            socket.join(user.room)
        console.log("user.room = ",user.room)
        console.log("socket id = ",socket.id)
        io.to(user.room).emit(`message`, {user : `admin` , text : `${name} Joined`})
        console.log('get users in room ',getUsersInRoom(user.room))
        let userinroom = getUser(socket.id);
        io.to(user.room).emit('online',getUsersInRoom(user.room));
        }
        }
        });

    socket.on('white-board', (message) => {
        socket.broadcast.to(message.room).emit('white-board',message);
    });

    socket.on('clearcanvas', (message) => {
        io.to(message.room).emit('clearcanvas',"clear");
    });

    socket.on('layoutchange',(message) => {
        io.to(message.room).emit('layoutchange',"clear");
    });

    socket.on('add-shapes',(obj) => {
        io.to(obj.room).emit('addshape',obj);  
    })

    socket.on('object-modify',(obj) => {
        io.to(obj.room).emit('object-modify',obj);  
    })

    socket.on('object-move',(obj) => {
        io.to(obj.room).emit('object-movee',obj);  
    })

    socket.on('remove-shape',(obj) => {
        io.to(obj.room).emit('remove-shape',obj);
    })

    socket.on('text-change',(obj) => {
        io.to(obj.room).emit('text-change',obj);
    })

    socket.on('mouse-down',(obj) => {
        io.to(obj.room).emit('mouse-down',obj);
    })

    socket.on('mouse-up',(obj) => {
        io.to(obj.room).emit('mouse-up',obj);
    })

    socket.on('hand-rise',(obj) => {
        if(obj.handrise) {
        io.to(obj.room).emit('hand-rise',obj);
        }
        getUserbymail(obj.email,obj.handrise);
        io.to(obj.room).emit('online',getUsersInRoom(obj.room));
    })

    
    socket.on('user-permision', (obj) => {
        const socketid = permissiontousers(obj.email,obj.permission);
        io.to(socketid).emit('permission-grantdeny', obj.permission);
        io.to(obj.room).emit('online',getUsersInRoom(obj.room));
    })

    socket.on('update-role',(obj) =>{
        const socketid = updaterole(obj.email,obj.role);
        io.to(obj.room).emit('online',getUsersInRoom(obj.room));    
    })

    socket.on('toggle-device',(obj) => {
        const socketid = togglepermission(obj.email,obj.audio,obj.video);
        io.to(obj.room).emit('online',getUsersInRoom(obj.room));    
    })

    socket.on('sendmessage', (message,callback)=>{
        const user = getUser(socket.id);
        console.log("user : ",user);
        var chat;
        if(user){
            if(message.file){
                io.to(user.room).emit('message' , {user : user.name, text : message,email : message.email,file : message.file,profile : user.profile})
                chat = new Chat({user :user.name,text : message.message, created : message.time,email : message.email,file : message.file,profile : user.profile});                    
            }
        else {
                console.log(message.profile)
                io.to(user.room).emit('message' , {user : user.name, text : message,email : message.email, profile : user.profile})
                chat = new Chat({user :user.name,text : message.message, created : message.time,email : message.email,profile : user.profile});
        }
        chat.save();
        callback();
        }
    });

    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        const removeduser = removeUser(socket.id);
        console.log("a user disconnected!",removeduser);
        if(removeUser){
        console.log(removeUser);
        io.to(removeduser.room).emit('online',getUsersInRoom(removeduser.room));
        console.log("user",removeduser);
        io.to(removeduser.room).emit('message',{user : `admin` ,text : removeduser.name + ` left`})
    }});
})

server.listen(5000, () => console.log("server is running on port 8000"),
{pingTimeout: 5000,
pingInterval: 10000}
);