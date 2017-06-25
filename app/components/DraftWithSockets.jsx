import React from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
} from 'draft-js';

export default class DraftWithSockets extends React.Component {
  constructor(){
    super();
    this.state = {
      dirty: false,
      editorState: EditorState.createEmpty(),
      remoteEditorState: EditorState.createEmpty(),
    }
    this.emitChanges = this.emitChanges.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.nullChange = ()=>0;
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this._onBoldClick = this._onBoldClick.bind(this);
  }

  componentDidMount(){
    this.setTimer();
    socket.on('update',remoteRawState=>{
      console.log('server update:',remoteRawState);

      if(!remoteRawState.entityMap) remoteRawState.entityMap = {};

      //convert rawState to editorState
      const contentStateConvertedFromRaw = convertFromRaw(remoteRawState);

      let newRemoteEditorState = EditorState.push(
        this.state.remoteEditorState,
        contentStateConvertedFromRaw
      );

      newRemoteEditorState = EditorState.forceSelection(
        newRemoteEditorState,
        this.state.remoteEditorState.getSelection()
      );

      this.setState({remoteEditorState: newRemoteEditorState});
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
      console.log('emitting changes:',
        this.state.editorState.getCurrentContent().getPlainText());

      //prepare editorState for emission
      const currentContent = this.state.editorState.getCurrentContent()
      const rawState = convertToRaw(currentContent);
      socket.emit('update',rawState);
      //socket.emit('update',this.state.text);
      this.setState({dirty: false});
    }
  }

  handleChange(editorState){
    this.setState({dirty: true});
    this.clearTimer();
    this.setState({editorState},this.setTimer);
  }

  //START - FROM draft.js editor  
  //-------------------------------------------------------
  handleKeyCommand(command){
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command);
    if(newState){
      this.handleChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  _onBoldClick(){
    this.handleChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
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
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.handleChange}
        />
        <h3>Remote text</h3>
        <Editor
          editorState={this.state.remoteEditorState}
          onChange={this.nullChange}
        />
      </div>

    )
  }
}
