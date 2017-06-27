import React from 'react';
import {
  convertFromRaw,
  convertToRaw,
  CompositeDecorator,
  ContentState,
  Editor,
  Entity,
  EditorState,
} from 'draft-js';

const rawContent = {
  blocks: [
    {
      text: 'I am a banana',
      type: 'unstyled',
      entityRanges: [{offset: 7, length: 6, key: 'fruit'}],
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
    return +entityKey === 1 ? true : false;
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
  }

  render () {

    return (
      <div>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
