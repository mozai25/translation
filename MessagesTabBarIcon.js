'use strict';

import React, {Component} from 'react';
import {View} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {Badge} from 'react-native-elements';
import {connect} from 'react-redux';
var DeviceInfo = require('react-native-device-info');

class MessagesTabBarIcon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentBadge: 0,
        };
    }

    UNSAFE_componentWillMount() {

        let foundCount = this.props.messages.messages.filter(
            (obj) =>
                obj.MessageReceived == 0 &&
                DeviceInfo.getUniqueId() != obj.DeviceId,
        ).length;
        this.setState({currentBadge: foundCount});
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any) {

        if (nextProps.messages.messages !== this.props.messages.messages) {

            let foundCount = nextProps.messages.messages.filter(
                (obj) =>
                    obj.MessageReceived == 0 &&
                    DeviceInfo.getUniqueId() != obj.DeviceId,
            ).length;
            this.setState({currentBadge: foundCount});
        }
    }

    render() {
        const {color, bagde} = this.props;
        return (
            <View>
                <Icons name="chatbubbles-sharp" size={35} color={color} />
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

export default connect(mapStateToProps)(MessagesTabBarIcon);
