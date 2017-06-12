import {MAP} from '../actions/ActionTypes';

const default_view = {
  center: [0, 0],
  zoom: 0,
  extent: [0, 0, 0, 0]
};

export default (state = default_view, action) => {
  switch (action.type) {
    case  MAP.GET_CONFIG:
      return action.mapState;
    case  MAP.SET_VIEW:
      return {
        ...state,
        center:action.center,
        zoom:action.zoom
      };
    case  MAP.SET_CENTER:
      return {
        ...state,
        center:action.center
      };
    case  MAP.SET_ZOOM:
      return {
        ...state,
        zoom:action.zoom
      };
    case  MAP.SET_EXTENT:
      return {
        ...state,
        extent:action.extent
      };
    case MAP.ZOOM_IN:
    //TODO:Check MaxZoom
      return {
        ...state,
        zoom:state.zoom + action.zoomDelta
      }
    case MAP.ZOOM_OUT:
      //TODO:Check MinZoom
      return {
        ...state,
        zoom:state.zoom - action.zoomDelta
      }
    default:
      return state
  }
}
