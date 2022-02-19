'use strict';

import React, {Component, PureComponent, useCallback} from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Image, Dimensions,
} from 'react-native';
import TextWithStyle from './TextWithStyle';
import Icons from 'react-native-vector-icons/Ionicons';
import Helpers from '../Model/Helpers';
import ProgressiveImage from './ProgressiveImage';

export default class PhoneItem extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {

        const {contact, onPress} = this.props;

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPress}
                style={styles.item}>

                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    position: 'relative',
                    paddingTop: 5,
                    paddingBottom: 5,
                }}>

                    <View style={{
                        flexDirection: 'column',
                    }}>
                        <View style={{
                            flexDirection: 'row',
                        }}>
                            <View style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                            }}>

                                {contact.hasThumbnail ? (
                                    <ProgressiveImage
                                        user={true}
                                        style={{
                                            borderRadius: 40,
                                            width: 80,
                                            height: 80,
                                            borderColor: '#3a6b33',
                                            borderWidth: 1,
                                            marginRight: 7,
                                            marginLeft: 4,
                                        }}
                                        uri={{uri: contact.thumbnailPath}}
                                    />
                                ) : (
                                    <ProgressiveImage
                                            user={true}
                                            style={{
                                                borderRadius: 40,
                                                width: 80,
                                                height: 80,
                                                borderColor: '#3a6b33',
                                                borderWidth: 1,
                                                marginRight: 7,
                                                marginLeft: 4,
                                            }}
                                            uri={require('../images/default_user.png')}
                                        />
                                )}

                            </View>
                            <View style={{
                                flexDirection: 'column',
                                width: '60%',
                            }}>
                                <View style={{
                                    marginBottom: 10,
                                }}>

                                    {contact.givenName != '' ? (
                                        <TextWithStyle style={{
                                            fontSize: 16,
                                            lineHeight: 20,
                                            fontWeight: 'bold',
                                            flex: 1,
                                            flexShrink: 1,
                                            flexWrap: 'wrap',
                                        }}>
                                            {contact.givenName.length < 20 ? (
                                                contact.givenName
                                            ) : (
                                                contact.givenName.slice(0, 19)+'...'
                                            )}
                                        </TextWithStyle>
                                    ) : (
                                        <TextWithStyle style={{
                                            fontSize: 16,
                                            lineHeight: 20,
                                            fontWeight: 'bold',
                                            flex: 1,
                                            flexShrink: 1,
                                            flexWrap: 'wrap',
                                        }}>
                                            Edit Name
                                        </TextWithStyle>
                                    )}
                                    {contact.familyName != '' ? (
                                        <TextWithStyle style={{
                                            fontSize: 16,
                                            lineHeight: 20,
                                            fontWeight: 'bold',
                                            flex: 1,
                                            flexShrink: 1,
                                            flexWrap: 'wrap',
                                        }}>
                                            {contact.familyName.length < 20 ? (
                                                contact.familyName
                                            ) : (
                                                contact.familyName.slice(0, 19)+'...'
                                            )}
                                        </TextWithStyle>
                                    ) : (
                                        null
                                    )}

                                    {contact.phoneNumbers.length > 0 ? (
                                        <TextWithStyle style={{
                                            fontSize: 12,
                                            lineHeight: 20,
                                            fontWeight: 'normal',
                                            color: '#6f737e',
                                        }}>
                                            {contact.phoneNumbers[0].number}
                                        </TextWithStyle>
                                    ) : (
                                        null
                                    )}

                                </View>

                            </View>
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '12%',
                            }}>
                                <Icons style={{
                                    opacity: 1,
                                    zIndex: 20,
                                }} name="ios-person-add-outline" size={32} color="#3a6b33" />
                            </View>
                        </View>
                    </View>
                </View>

            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({

    stretch_new: {
        width: Dimensions.get('window').width/2-65,
        height: Dimensions.get('window').width/2-65,
        resizeMode: 'stretch',
    },
    item: {
        backgroundColor: '#edebeb',//cee3f4
        paddingLeft: 0,
        paddingTop: 5,
        paddingBottom: 5,
        marginVertical: 3,
        marginHorizontal: 15,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderTopWidth: 0.5,
        borderLeftWidth: 0.5,
        borderColor: '#3a6b33',//3a6b33
        borderRadius: 5,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 5,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        shadowColor: '#3a6b33',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 2,
            width: 2,
        },
    },
});