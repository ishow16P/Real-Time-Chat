const express = require('express');
const socketio = require('socket.io');
const app = express();

app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',(req,res) =>{
    res.render('index')
});

const server = app.listen(process.env.PORT || 8000, ()=>{
    console.log('Server is Runnimg Port 8000')
})

//Initalize socket for the server
const io = socketio(server)

io.on('connection', socket =>{
    console.log('New User Connected')

    socket.username = "Anonymous"

    socket.on("change_username", data =>{
        socket.username = data.username
    })


    //handle new message event
    socket.on("new_message", data =>{
        console.log("new message")
        io.sockets.emit("receive_message",{message: data.message, username: socket.username})
    })

    socket.in('typing', data =>{
        socket.broadcast.emit('typing',{ username: socket.username})
    })
})