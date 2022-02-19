'use strict';

import React from 'react';
import {Text, StyleSheet} from 'react-native';
import TranslateText from './TranslateText';

export default (props) => {

  /*
    typeof props.children === 'object' ||
    typeof props.children === 'array'  ||
    typeof props.children === 'number'
   */

  const text =
    typeof props.children === 'string' ? (
        <TranslateText text={props.children} />
    ) : (
        props.children
    );

  const incomingStyle = Array.isArray(props.style)
    ? props.style
    : [props.style];
  return (
    <Text {...props} style={[styles.item, ...incomingStyle]}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  item: {
    color: '#31353A',
    fontFamily: 'Helvetica',
    fontSize: 14,
  },
});
