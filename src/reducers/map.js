import {MAP} from '../actions/ActionTypes';
export default (state = [], action) => {
  switch (action.type) {
    case  MAP.GET_CONFIG:
      return action.mapState;
    case  MAP.SET_VIEW:
      return {
        ...state,
        view:{
          ...state.view,
          center:action.center,
          zoom:action.zoom
        }
      };
    case  MAP.SET_CENTER:
      return {
        ...state,
        view:{
          ...state.view,
          center:action.center
        }
      };
    case  MAP.SET_ZOOM:
      return {
        ...state,
        view:{
          ...state.view,
          zoom:action.zoom
        }
      };
    case MAP.ZOOM_IN:
    //TODO:Check MaxZoom
      return {
        ...state,
        view:{
          ...state.view,
          zoom:state.view.zoom + action.zoomDelta
        }
      }
    case MAP.ZOOM_OUT:
      //TODO:Check MinZoom
      return {
        ...state,
        view:{
          ...state.view,
          zoom:state.view.zoom - action.zoomDelta
        }
      }
    default:
      return state
  }
}
