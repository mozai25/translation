'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Button,
    ScrollView,
    Platform,
    TouchableOpacity,
    Linking,
    BackHandler,
    Alert,
    KeyboardAvoidingView,
    Image,
    ActivityIndicator,
    PixelRatio,
    Dimensions,
    NativeModules,
    NativeEventEmitter,
    Animated,
    FlatList,
    RefreshControl,
    SafeAreaView,
    Keyboard,
    PermissionsAndroid,
    LogBox
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { StackActions, NavigationActions } from 'react-navigation';

import Helpers from '../Model/Helpers';
import TextWithStyle from '../components/TextWithStyle';
import PhoneItem from '../components/PhoneItem';
//var SubScribePlan = NativeModules.SubScribePlan;
//const mySubScribePlan = new NativeEventEmitter(SubScribePlan);
var DeviceInfo = require('react-native-device-info');
import ProgressiveImage from '../components/ProgressiveImage';
import {getStatusBarHeight} from '../Model/HeaderHeightClass';
import Icons from 'react-native-vector-icons/Ionicons';
import Contacts from 'react-native-contacts';
var SecurityCircleConnectorEx = NativeModules.SecurityCircleConnectorEx;

//redux
import {connect} from 'react-redux';
import TranslateStatic from '../Model/TranslateStatic';
import MyCommunication from '../Model/MyCommunication';

class PhoneBook extends Component {
    constructor(props) {
        super(props);

        LogBox.ignoreLogs(['currentlyFocusedField','new NativeEventEmitter']);

        this.searchBar = null;
        this.keyboardHeight = new Animated.Value(5);
        this.state = {
            dataItemsContacts: [],
            allDataItemsContacts: [],
            keyboardHeight: new Animated.Value(5),
            marginBottom: 5,
            searchText: '',
        }
    }

    searchFilterFunction = (text) => {

        if (text) {

            const newData = this.state.allDataItemsContacts.filter(function (item) {
                const itemData = item.givenName
                    ? item.givenName.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });

            this.setState({dataItemsContacts: newData});
        } else {
            this.setState({dataItemsContacts: this.state.allDataItemsContacts});
        }
    };

    keyboardWillShow = (event) => {

        Animated.parallel([
            Animated.timing(this.state.keyboardHeight, {
                duration: 0, //event.duration,
                toValue: event.endCoordinates.height,
                useNativeDriver: false,
            }),
        ]).start(() => {
            //alert(this.keyboardHeight._value);
            this.setState({marginBottom: (PixelRatio.get() >=3 ? 320 : 260)});
        });

    }

    keyboardWillHide = (event) => {

        Animated.parallel([
          Animated.timing(this.state.keyboardHeight, {
            duration: 0.1,
            toValue: 5,
            useNativeDriver: false,
          }),
        ]).start(() => {
            this.setState({marginBottom: 5});
        });
    }

    _onUserSearchChange = (text) => {

        this.setState({searchText: text});
        this.searchFilterFunction(text);

    }

    componentDidMount() {

        this.props.navigation.setParams({backTitle: <TextWithStyle style={{
                color: '#e4eaf1',
                fontSize: 16,
                fontWeight: 'bold',
                margin: 0,
                padding: 0,
                opacity: 1,
            }}>Back</TextWithStyle>});

        this.props.navigation.setParams({headerTitle: <TextWithStyle style={{
                color: '#e4eaf1',
                fontSize: 18,
                fontWeight: 'bold',
                margin: 0,
                padding: 0,
                opacity: 1,
                width: '100%',
                textAlign: 'center',
            }}>Contacts</TextWithStyle>});

        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                if (this.goBackValue) {
                    this.goBackValue = false;
                    this.props.navigation.navigate('CodesList', {

                    });
                } else {

                }
            }
        );

    }

    getContacts = () => {
        Contacts.getAll().then(contacts => {
            const contactsList = contacts
                .sort(function(a, b) {
                    if(a.givenName.toLowerCase() < b.givenName.toLowerCase()) return -1;
                    if(a.givenName.toLowerCase() > b.givenName.toLowerCase()) return 1;
                    return 0;
                })
            this.setState({dataItemsContacts: contactsList});
            this.setState({allDataItemsContacts: contactsList});
            this.forceUpdate();
        });

    }

    showContactsItems = () => {

        SecurityCircleConnectorEx.CheckContactsAccessEnabled(
        "contacts",
        (result) => {

            if (result != 'Restricted') {
                this.getContacts();
            } else {
                this.showMessageAlert();
            }
        });

    }

    UNSAFE_componentWillMount() {

        this.keyboardWillShowSub = Keyboard.addListener(
            'keyboardWillShow',
            this.keyboardWillShow,
        );

        this.keyboardWillHideSub = Keyboard.addListener(
            'keyboardWillHide',
            this.keyboardWillHide,
        );

        try {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_CONTACTS
//              {
//                title: "Access Contacts Permission",
//                message:
//                  "Allow Be Close to access your contacts.",
//                buttonNeutral: "Ask Me Later",
//                buttonNegative: "Cancel",
//                buttonPositive: "OK"
//              }
            ).then(granted => {

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                  this.getContacts();
                } else {
                    Alert.alert(
                      TranslateStatic.sharedInstance.translateText("Restricted Access to Contacts"),
                      TranslateStatic.sharedInstance.translateText("Check Settings to permit the access to Contacts"),
                      [
                          {
                              text: TranslateStatic.sharedInstance.translateText("Cancel"),
                              onPress: () => {
                                  //console.log("Cancel Pressed");
                              },
                              style: "cancel"
                          },
                          {
                              text: TranslateStatic.sharedInstance.translateText("Check Contacts Settings"),
                              onPress: () => {
                                  SecurityCircleConnectorEx.RedirectToAppLocationSettings( "",
                                      (tests) => {
                                          //callback('OK');
                                      },
                                  );
                              }
                          }
                      ]
                  )
                }
            })
          } catch (err) {
            console.warn(err);
          }

    }



    componentWillUnmount() {
        if(this.keyboardWillShowSub != null && this.keyboardWillShowSub != undefined) this.keyboardWillShowSub.remove();
        if(this.keyboardWillHideSub != null && this.keyboardWillHideSub != undefined) this.keyboardWillHideSub.remove();
    }

    returnData = (value) => {
        this.goBackValue = value;
    }

    ItemPhone = (contact, savedParentCodes) => {

        var nav = this.props.navigation;

        return (
            <PhoneItem contact={contact} onPress={(event) => {
                var codeKidsValue = Helpers._createCodeText(Helpers.numberCodeLength);

                nav.navigate('CreateCodeForKid', {
                    codeForKids: codeKidsValue,
                    codesArray: savedParentCodes,
                    reconnect: false,
                    fromSharedUser: null,
                    contactFromBook: contact,
                    returnData: this.returnData.bind(this),
                });
                //event.stopPropagation();

            }} />
        );
    }

    Item (contact) {

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={(event) => {

                    var codeKidsValue = Helpers._createCodeText(Helpers.numberCodeLength);

                    this.props.navigation.navigate('CreateCodeForKid', {
                        codeForKids: codeKidsValue,
                        codesArray: MyCommunication.sharedInstance.savedParentCodes,
                        reconnect: false,
                        fromSharedUser: null,
                        contactFromBook: contact,
                        returnData: this.returnData.bind(this),
                    });

                    event.stopPropagation();

                }}
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

    showMessageAlert = async () => {

      try {
            PermissionsAndroid.check(
              PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
              {
                title: TranslateStatic.sharedInstance.translateText("Restricted Access to Contacts"),
                message:TranslateStatic.sharedInstance.translateText("Check Settings to permit the access to Contacts"),
                buttonNegative: TranslateStatic.sharedInstance.translateText("Cancel"),
                buttonPositive: TranslateStatic.sharedInstance.translateText("Check Contacts Settings")
              }
            ).then(response => {

                if (response == PermissionsAndroid.RESULTS.GRANTED) {
                  this.getContacts();
                } else {
                  Alert.alert(
                      TranslateStatic.sharedInstance.translateText("Restricted Access to Contacts"),
                      TranslateStatic.sharedInstance.translateText("Check Settings to permit the access to Contacts"),
                      [
                          {
                              text: TranslateStatic.sharedInstance.translateText("Cancel"),
                              onPress: () => {
                                  //console.log("Cancel Pressed");
                              },
                              style: "cancel"
                          },
                          {
                              text: TranslateStatic.sharedInstance.translateText("Check Contacts Settings"),
                              onPress: () => {
                                  SecurityCircleConnectorEx.RedirectToAppLocationSettings( "",
                                      (tests) => {
                                          //callback('OK');
                                      },
                                  );
                              }
                          }
                      ]
                  )
                }

            });

      } catch (err) {
        console.warn(err);
        alert(err);
      }

    }

    emptyComponent = () => {

        return (

            <View style={{
                width: Dimensions.get('window').width,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 50,
                paddingLeft: 10,
                paddingRight: 10,
                zIndex: 100,
            }}>
                <TextWithStyle style={{
                    fontSize: 23,
                    color: '#276e66',
                    alignSelf: 'center',
                    textAlign: 'center',
                }}>
                    Refresh Contacts
                </TextWithStyle>

                <View style={{
                    marginTop: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 0,
                    width: Dimensions.get('window').width/2,
                }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={(event) => {

                            if (this.searchBar != null) {
                                this.searchBar.clear();
                                this.searchBar.cancel();
                            }

                            this.showMessageAlert();

//                                SecurityCircleConnectorEx.CheckContactsAccessEnabled(
//                                    "contacts",
//                                    (result) => {
//                                        console.log(result);
//                                        if (result == 'Restricted') {
//                                            this.showMessageAlert();
//                                        } else {
//                                            this.getContacts();
//                                        }
//                                    });

                        }}
                        style={{
                            position: "relative",
                            backgroundColor: '#a0ddd8',////93bee1
                            borderRadius: 5,
                            borderRightWidth: 2,
                            borderBottomWidth: 2,
                            borderTopWidth: 0.5,
                            borderLeftWidth: 0.5,
                            borderColor: '#85bbb7',//3a6b33
                            // marginRight: 15,
                            marginLeft: 45/3,
                            // marginTop: 15,
                            marginBottom: 5,
                            width: Dimensions.get('window').width/2-45,
                            height: Dimensions.get('window').width/2-45,
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: '#3a6b33',
                            shadowOpacity: 0.8,
                            shadowRadius: 3,
                            shadowOffset: {
                                height: 2,
                                width: 2,
                            },
                        }}>
                        <Image
                            style={styles.stretch_new}
                            source={require('../images/group_btn_200x200.png')}
                        />
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 0,
                            position: "absolute",
                            bottom: -34,
                        }}>
                            <TextWithStyle
                                style={{
                                    color: '#276e66',
                                    textAlign: 'center',
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    fontSize: 14,
                                }}>
                                Contacts
                            </TextWithStyle>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }

    render() {

        return (

            <Animated.View
                contentContainerStyle={{

                }}
                style={{
                    height: Dimensions.get('window').height,
                    width: Dimensions.get('window').width,
                    backgroundColor: Helpers.generalBodyColor,
                    //flex: 1,
                }} >

                <View style={{
                    height: 70,
                }}>
                    <SearchBar
                        ref={search => this.searchBar = search}
                        containerStyle={{
                            backgroundColor: Helpers.generalBodyColor,
                        }}
                        inputContainerStyle={{
                            backgroundColor: '#fff',

                        }}
                        cancelButtonProps={{
                            color: '#3a6b33',
                        }}
                        placeholderTextColor={'#3a6b33'}
                        platform={'ios'}
                        lightTheme={true}
                        placeholder={TranslateStatic.sharedInstance.translateText('Search')}
                        onChangeText={this._onUserSearchChange}
                        value={this.state.searchText}
                            style={{
                                height: 34,
                                fontSize: 21,
                                padding: 0,
                                borderBottomColor: 'transparent',//'#20b7a4',
                                borderRightColor: 'transparent',
                                borderLeftColor: 'transparent',
                                borderTopColor: 'transparent',
                                color: '#48BBEC',
                            }}
                    />

                </View>

                <SafeAreaView
                    style={{
                        backgroundColor: Helpers.generalBodyColor,
                    }}>
                    <FlatList
                        maxToRenderPerBatch={10}
                        initialNumToRender={10}
                        scrollEventThrottle={1}
                        activeOpacity={0.7}
                        ListEmptyComponent={this.emptyComponent}
                        bounces={false}
                        style={{
                            width: Dimensions.get('window').width,
                            height: Dimensions.get('window').height - (PixelRatio.get() >=3 ? 115 : 105) - getStatusBarHeight(), // - this.state.marginBottom,
                        }}
                        data={this.state.dataItemsContacts}
                        renderItem={({item}) => this.ItemPhone(item, MyCommunication.sharedInstance.savedParentCodes)}
                        keyExtractor={(item, index) => item.recordID}
                        removeClippedSubviews={false}
                    />
                </SafeAreaView>

            </Animated.View>
        )

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

const mapStateToProps = (state) => {
    const {messages} = state;
    return {messages};
};

export default connect(mapStateToProps)(PhoneBook);