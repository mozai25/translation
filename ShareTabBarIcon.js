'use strict';

import React, {Component} from 'react';
import {View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Badge} from 'react-native-elements';
import {connect} from 'react-redux';

class ShareTabBarIcon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentBadge: 0,
    };
  }

  UNSAFE_componentWillMount() {

    this.setState({currentBadge: (this.props.messages.codes.child_codes).length});
  }

  UNSAFE_componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any) {

      if (this.props.messages.codes.child_codes != nextProps.messages.codes.child_codes) {
          this.setState({currentBadge: (nextProps.messages.codes.child_codes).length});
      }
  }

  render() {
    const {color, bagde} = this.props;
    return (
      <View>
        <MaterialCommunityIcons name="antenna" size={35} color={color} />
        {bagde && this.state.currentBadge > 0 ? (
          <Badge
            value={this.state.currentBadge}
            status="error"
            textStyle={{
              fontSize: 16,
            }}
            badgeStyle={{
              height: 25,
              width: 25,
              borderRadius: 15,
            }}
            containerStyle={{
              position: 'absolute',
              top: -7,
              right: -12,
            }}
          />
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const {messages} = state;
  return {messages};
};

export default connect(mapStateToProps)(ShareTabBarIcon);
