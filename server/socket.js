module.exports = io => {
  io.on('connection',function(socket){
    console.log('new user connected, id:',socket.id);
    //io.emit('update','test notification');
    socket.on('update',function(data){
      console.log('update from id:',socket.id,' msg:',data);
      socket.broadcast.emit('update',data);
    });
  });
}
