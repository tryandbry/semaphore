//import axios from 'axios'
import { EditorState,
  convertFromRaw,
  convertToRaw,
} from 'draft-js';

const INIT = {
  dirty: false,
  editorState: EditorState.createEmpty(),
  remoteEditorState: EditorState.createEmpty(),
};

const reducer = (state=INIT, action) => {
  const newState = Object.assign({},state);

  switch (action.type) {
    case EMIT:
      if(state.dirty){
        //prepare editorState for emission
        const currentContent = state.editorState.getCurrentContent();
        const rawState = convertToRaw(currentContent);
        socket.emit('update',rawState);
        newState.dirty = false;
        return newState;
      }
      break;

    case UPDATE_LOCAL:
      newState.dirty = true;
      newState.editorState = action.editorState;
      return newState;

    case UPDATE_REMOTE:
      if(!action.remoteRawState.entityMap)
        action.remoteRawState.entityMap = {};

      //convert rawState to editorState
      const contentStateConvertedFromRaw =
        convertFromRaw(action.remoteRawState);

      let newRemoteEditorState = EditorState.push(
        state.remoteEditorState,
        contentStateConvertedFromRaw
      );

      newRemoteEditorState = EditorState.forceSelection(
        newRemoteEditorState,
        state.remoteEditorState.getSelection()
      );

      newState.remoteEditorState = newRemoteEditorState;

      return newState;
  }

  return state;
}

const EMIT = 'EMIT';
const UPDATE_LOCAL = 'UPDATE_LOCAL';
const UPDATE_REMOTE = 'UPDATE_REMOTE';
export const emitChanges = () => ({
  type: EMIT,
});
export const editorUpdate = editorState => ({
  type: UPDATE_LOCAL,
  editorState
});
export const remoteEditorUpdate = remoteRawState => ({
  type: UPDATE_REMOTE,
  remoteRawState
});

/*
export const whoami = () =>
  dispatch =>
    axios.get('/api/auth/whoami')
      .then(response => {
        const user = response.data
        dispatch(authenticated(user))
      })
      .catch(failed => dispatch(authenticated(null)))
*/

export default reducer;
