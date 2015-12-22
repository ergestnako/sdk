import React from 'react';
import ReactDOM from 'react-dom';
import Dialog from 'pui-react-modals';
import filtrex from 'filtrex';
import Grids from 'pui-react-grids';
import UI from 'pui-react-buttons';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

const messages = defineMessages({
  title: {
    id: 'labelmodal.title',
    description: 'Title for the label modal dialog',
    defaultMessage: 'Label for layer {layer}'
  },
  applybutton: {
    id: 'labelmodal.applybutton',
    description: 'Text for the apply button',
    defaultMessage: 'Apply'
  },
  clearbutton: {
    id: 'labelmodal.clearbutton',
    description: 'Text for the clear button',
    defaultMessage: 'Clear'
  },
  attributelabel: {
    id: 'labelmodal.attributelabel',
    description: 'Text for label for the attribute select combo',
    defaultMessage: 'Attribute'
  }
});

class LabelModal extends Dialog.Modal {
  constructor(props) {
    super(props);
    this.state = {
      attributes: []
    };
    var source = this.props.layer.getSource();
    if (source && !(source instanceof ol.source.Cluster)) {
      source.on('change', function(evt) {
        if (evt.target.getState() === 'ready' && this.state.attributes.length === 0) {
          var feature = evt.target.getFeatures()[0];
          if (feature) {
            var geom = feature.getGeometryName();
            var keys = feature.getKeys();
            var idx = keys.indexOf(geom);
            keys.splice(idx, 1);
            this.state.attributes = keys;
            this.state.attribute = keys[0];
          }
        }
      }, this);
    }
  }
  _setStyleFunction() {
    var layer = this.props.layer;
    var style = layer.getStyle();
    this._style = style;
    this._styleSet = true;
    var me = this;
    layer.setStyle(function(feature, resolution) {
      var rawValue = feature.get(me.state.attribute);
      var value = '';
      if (rawValue !== undefined) {
        value += rawValue;
      }
      var text = new ol.style.Text({
        text: value,
        font: '12px Calibri,sans-serif',
        fill: new ol.style.Fill({
          color: '#000'
        })
      });
      var modifyStyle = function(s) {
        if (s instanceof ol.style.Style) {
          s.setText(text);
        } else if (Array.isArray(s)) {
          s.push(new ol.style.Style({
            text: text
          }));
        }
        return s;
      };
      if (style instanceof ol.style.Style || Array.isArray(style)) {
        return modifyStyle(style);
      } else {
        var result = style.call(feature, resolution);
        return modifyStyle(result);
      }
    });
  }
  _onSubmit(evt) {
    evt.preventDefault();
  }
  _onItemChange(evt) {
    this.state.attribute = evt.target.value;
  }
  _clearLabel() {
    if (this._style) {
      this.props.layer.setStyle(this._style);
      this._styleSet = false;
    }
  }
  _setLabel() {
    if (!this._styleSet) {
      this._setStyleFunction();
    } else {
      this.props.layer.changed();
    }
  }
  render() {
    const {formatMessage} = this.props.intl;
    var me = this;
    var attributeItems = this.state.attributes.map(function(attribute, idx) {
      return (
        <option value={attribute} key={idx}>{attribute}</option>
      );
    });
    return (
      <Dialog.BaseModal title={formatMessage(messages.title, {layer: this.props.layer.get('title')})} show={this.state.isVisible} onHide={this.close} {...this.props}>
        <Dialog.ModalBody>
          <form onSubmit={this._onSubmit} className='form-horizontal'>
            <div className="form-group">
              <Grids.Col md={4}>
                <label htmlFor='labelSelector'>{formatMessage(messages.attributelabel)}:</label>
              </Grids.Col>
              <Grids.Col md={8}>
                <select id='labelSelector' defaultValue={this.state.attribute} onChange={this._onItemChange.bind(this)}>
                  {attributeItems}
                </select>
              </Grids.Col>
            </div>
          </form>
        </Dialog.ModalBody>
        <Dialog.ModalFooter>
          <UI.DefaultButton onClick={this._setLabel.bind(this)}>{formatMessage(messages.applybutton)}</UI.DefaultButton>
          <UI.DefaultButton onClick={this._clearLabel.bind(this)}>{formatMessage(messages.clearbutton)}</UI.DefaultButton>
        </Dialog.ModalFooter>
      </Dialog.BaseModal>
    );
  }
}

export default injectIntl(LabelModal, {withRef: true});
