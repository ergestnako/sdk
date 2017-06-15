/*
 * Copyright 2015-present Boundless Spatial Inc., http://boundlessgeo.com
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 */

import ZoomView from './ZoomView';
import {connect} from 'react-redux';
import * as MapActions from '../actions/MapActions';

// Maps state from store to props
const mapStateToProps = (state) => {
  return {
    zoom: state.mapState.view.zoom || null
  }
};


// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
    setView: view => dispatch(MapActions.setView(view))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ZoomView);
