import React from 'react';

export default class Semaphore extends React.Component {
  constructor(){
    super();
    this.state = {
      text: "",
      dirty: false,
      remoteText: "",
    }
    this.emitChanges = this.emitChanges.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    this.setTimer();
    socket.on('update',remoteText=>{
      console.log('server update:',remoteText);
      this.setState({remoteText});
    });
  }

  setTimer(){
    return this.unSetTimer = setInterval(this.emitChanges,3000);
  }

  clearTimer(){
    return clearInterval(this.unSetTimer);
  }

  emitChanges(){
    //console.log('socketID:',socket.id);
    if(this.state.dirty){
      console.log('emitting changes:',this.state.text);
      socket.emit('update',this.state.text);
      this.setState({dirty: false});
    }
  }

  handleChange(event){
    this.setState({dirty: true});
    this.clearTimer();
    this.setState({text: event.target.value},this.setTimer);
  }

  render(){

    return (
      <div>
        <form>
          <input
            type="text"
            onChange={this.handleChange}>
          </input>
        </form>
        <textarea value={this.state.remoteText}></textarea>
      </div>
    )
  }
}
