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

 import React from 'react';
 import ReactDOM from 'react-dom';
 import ol from 'openlayers';
 import './MapPanel.css';
 import {injectIntl, intlShape} from 'react-intl';
 import classNames from 'classnames';


 /**
  * A div that can render the OpenLayers map object. It will also take care of notifying the user of load errors.
  * It can also provide integration with the browser's back and forward button for extent history navigation.
  *
  * ```xml
  * <Map id='map' map={map} />
  * ```
  */
 class Map extends React.PureComponent {
  //TODO: extent proptype, useHistory propTypes
  static propTypes = {
    /**
     * The map to use for this map panel.
     */
    map: React.PropTypes.instanceOf(ol.Map).isRequired,
    /**
     * Identifier of the map div.
     */
    id: React.PropTypes.string,
    /**
     * Css class name to apply on the map div.
     */
    className: React.PropTypes.string,
    /**
     * Style config
     */
    style: React.PropTypes.object,
    /**
     * @ignore
     */
    children: React.PropTypes.node,
    /**
    * @ignore
    */
    intl: intlShape.isRequired
  }
  static contextTypes = {
    //proxy and requestheaders are used with 'npm run proxy' script when using a geoserver on localhost
    proxy: React.PropTypes.string,
    requestHeaders: React.PropTypes.object
  };
  static defaultProps = {
  };
  constructor(props, context) {
    super(props);
    this._proxy = context.proxy;
    this._requestHeaders = context.requestHeaders;
    //sets initial map state tree, off for now
    /*
    if (this.props.hasOwnProperty('getMap')) {
      this.props.getMap(this.props.map);
    }
    */
  }

  componentDidMount() {
    var map = this.props.map;
    map.setTarget(ReactDOM.findDOMNode(this.refs.map));
    // when the map moves, dispatch an action
    map.on('moveend', () => {
      // get the view of the map
      let view = map.getView();
      let center = view.getCenter();
      let zoom = view.getZoom();
      // create a "mapAction" and dispatch it.
      this.props.setCenter(center);
      this.props.setZoom(zoom);
    });
  }
  componentWillUpdate(nextProps, nextState) {
    const mapView = this.props.map.getView();
    const stateView = nextProps.mapStore.view;

    const mapCenter = mapView.getCenter();
    const mapZoom = mapView.getZoom();

    if (mapCenter[0] !== stateView.center[0] || mapCenter[1] !== stateView.center[1] || mapZoom !== stateView.zoom) {
      this.props.map.getView().setCenter(stateView.center);
      this.props.map.getView().setZoom(stateView.zoom);
    }

  }
  render() {
    return (
      <div style={this.props.style} id={this.props.id} ref='map' className={classNames('sdk-component map-panel', this.props.className)}>
        {this.props.children}
      </div>
    );
  }
}
 export default injectIntl(Map);
