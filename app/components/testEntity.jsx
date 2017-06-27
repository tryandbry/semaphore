import React from 'react';
import {
  convertFromRaw,
  convertToRaw,
  CompositeDecorator,
  ContentState,
  Editor,
  Entity,
  SelectionState,
  EditorState,
} from 'draft-js';

const rawContent = {
  blocks: [
    {
      text: 'I am a banana',
      type: 'unstyled',
      entityRanges: [
        {offset: 7, length: 6, key: 'fruit'}
      ],
    },
  ],
  entityMap : {
    fruit: {
      type: 'fruit',
      mutability: 'IMMUTABLE',
    },
  },
};

const fruitStrategy = (contentBlock,callback,contentState) => {
  const filterFn = (charMetadata) => {
    const entityKey = charMetadata.getEntity();
    console.log('entityKey:',entityKey);
    return entityKey ? true : false;
  };
  contentBlock.findEntityRanges(filterFn,callback);
}

const fruitSpan = (props) => {
  const fruitStyle = {
    backgroundColor: 'rgba(204, 204, 255, 1.0)',
    padding: '2px 0',
  };

  return (
    <span data-offset-key={props.offsetkey} style={fruitStyle}>
       {props.children}
    </span>
  );
}

const findMatches = (str,word,entityKey) => {
  if(!word || typeof word != "string" || word.length === 0) return [];
  let modstr = str;
  let buffer = [];
  let r = new RegExp(`\\b${word}\\b`,'i');
  let searchResult = r.exec(modstr);
  let start = 0;
  while(searchResult) {
    buffer.push({
      offset: start + searchResult.index,
      length: word.length,
      key: entityKey,
    });
    start += searchResult.index + word.length;
    modstr = modstr.slice(searchResult.index + word.length);
    searchResult = r.exec(modstr);
  } 
  return buffer;
}

export default class extends React.Component {
  constructor(){
    super();
    const decorator = new CompositeDecorator([
      {
        strategy: fruitStrategy,
        component: fruitSpan,
      },
    ]);

    const blocks = convertFromRaw(rawContent);
    this.state = {
      editorState: EditorState.createWithContent(blocks,decorator),
    };
    this.onChange = editorState => this.setState({editorState});
    this.entitySubmit = this.entitySubmit.bind(this);
  }

  entitySubmit(event){
    event.preventDefault();

    const rawContent = convertToRaw(this.state.editorState.getCurrentContent());
    console.log(rawContent);
    rawContent.blocks.forEach(contentBlock=>{
      let newEntityRanges = findMatches(contentBlock.text,event.target.entityform.value,'fruit');
      console.log('new ranges:',newEntityRanges);
      contentBlock.entityRanges = newEntityRanges;
    });
    rawContent.entityMap = {
      fruit: {
        type: 'fruit',
        mutability: 'IMMUTABLE',
      },
    };
    console.log('after:',rawContent);
    const newContentState = convertFromRaw(rawContent);
    const newEditorState = EditorState.push(this.state.editorState,newContentState);
    this.setState({editorState: newEditorState});
  }

  render () {

    return (
      <div>
        <form onSubmit={this.entitySubmit}>
          <div className="form-group">
              <input type="text" className="form-control" id="entityform"></input>
          </div>
          <button type="submit" className="btn btn-default">Submit new entity</button>
        </form>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
        />
        <button onClick={()=>console.log('log state:',convertToRaw(this.state.editorState.getCurrentContent()))}>Log</button>
        <button onClick={()=>console.log('getEntity:',
          this.state.editorState.getCurrentContent().getLastCreatedEntityKey()
        )}>getEntity</button>
        <button onClick={()=>console.log('selectionState:',
          SelectionState.createEmpty()
        )}>createSelection</button>
      </div>
    );
  }
}
