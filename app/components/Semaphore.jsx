import React from 'react';

export default class Semaphore extends React.Component {
  constructor(){
    super();
    this.state = {
      text: "",
    }
  }

  render(){

    return (
      <div>
        <form>
          <input type="text"></input>
        </form>
      </div>
    )
  }
}
