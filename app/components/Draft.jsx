import React from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';

export default class MyEditor extends React.Component {
  constructor(){
    super();
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = editorState => this.setState({editorState});
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this._onBoldClick = this._onBoldClick.bind(this);
    this._logState = this._logState.bind(this);
  }

  handleKeyCommand(command){
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command);
    if(newState){
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  _onBoldClick(){
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'BOLD'
    ));
  }

  _logState(){
    let contentState = this.state.editorState.getCurrentContent();
    console.log(convertToRaw(contentState));
  }

  render(){

    return (
      <div>
        <button onClick={this._onBoldClick}>bold</button>
        <button onClick={this._logState}>Log State</button>
        <Editor
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
        />
      </div>
    )
  }
}
