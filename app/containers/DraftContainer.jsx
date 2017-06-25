import React from 'react';
import {connect} from 'react-redux';
import {
  Editor,
  RichUtils,
} from 'draft-js';
import {
  editorUpdate,
  remoteEditorUpdate,
  emitChanges,
} from '../reducers/editor';

class DraftContainer extends React.Component {
  constructor(){
    super();

    this.handleChange = this.handleChange.bind(this);
    this.nullChange = ()=>0;
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this._onBoldClick = this._onBoldClick.bind(this);
  }

  componentDidMount(){
    this.setTimer();
    socket.on('update',remoteRawState=>{
      console.log('server update:',remoteRawState);

      this.props.remoteEditorUpdate(remoteRawState);
    });
  }

  setTimer(){
    return this.unSetTimer = setInterval(this.props.emitChanges,3000);
  }

  clearTimer(){ clearInterval(this.unSetTimer) }

  handleChange(editorState){
    this.props.editorUpdate(editorState);
    this.clearTimer();
    this.setTimer();
  }

  //START - FROM draft.js editor  
  //-------------------------------------------------------
  handleKeyCommand(command){
    const newState = RichUtils.handleKeyCommand(
      this.props.editorState,
      command);
    if(newState){
      this.handleChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  _onBoldClick(){
    this.handleChange(RichUtils.toggleInlineStyle(
      this.props.editorState,
      'BOLD'
    ));
  }
  //END - FROM draft.js editor  
  //-------------------------------------------------------

  render(){

    return (
      <div>
        <h3>my text</h3>
        <button onClick={this._onBoldClick}>bold</button>
        <Editor
          editorState={this.props.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.handleChange}
        />
        <h3>Remote text</h3>
        <Editor
          editorState={this.props.remoteEditorState}
          onChange={this.nullChange}
        />
      </div>

    )
  }
}

const mapState = ({
  editor: {
    dirty,
    editorState,
    remoteEditorState
  }
}) => ({
  dirty,
  editorState,
  remoteEditorState,
});

const mapDispatch = {
  editorUpdate,
  remoteEditorUpdate,
  emitChanges,
};
export default connect(mapState,mapDispatch)(DraftContainer);
