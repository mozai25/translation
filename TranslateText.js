'use strict';

import React, { Component, } from 'react';
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import {I18nManager, Text} from 'react-native';

const translationGetters = {
    // lazy requires (metro bundler does not support symlinks)
    en: () => require('../translations/en.json'),
    ru: () => require('../translations/ru.json'),
    sk: () => require('../translations/sk.json'),
    es: () => require('../translations/es.json'),
    de: () => require('../translations/de.json'),
    fr: () => require('../translations/fr.json'),
    nl: () => require('../translations/nl.json'),
    da: () => require('../translations/da.json'),
};

const translate = memoize(
    (key, config)=>{
        return i18n.t(key, config);
    },
    (key, config) => {
        return (config ? key + JSON.stringify(config) : key);
    }
);

const setI18nConfig = () => {
    // fallback if no available language fits
    const fallback = { languageTag: 'en', isRTL: false };
    const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;

    // clear translation cache
    translate.cache.clear();
    // update layout direction
    I18nManager.forceRTL(isRTL);
    // set i18n-js config
    i18n.translations = { [languageTag]: translationGetters[languageTag]() };
    i18n.locale = languageTag;
};

const translateText = (text) => {
    setI18nConfig();

    return translate(text, {
        missingBehaviour: 'guess',
        defaultValue: text,
    });

}

export default class TranslateText extends Component {

    constructor(props) {
        super(props);
        setI18nConfig(); // set initial config
    }

    componentDidMount() {
        RNLocalize.addEventListener('change', this.handleLocalizationChange);
    }

    componentWillUnmount() {
        RNLocalize.removeEventListener('change', this.handleLocalizationChange);
    }

    handleLocalizationChange = () => {
        setI18nConfig();
    };

    render() {
        const {text} = this.props;

        return (
            <Text>{translate(text, {
                missingBehaviour: 'guess',
                defaultValue: text,
            })}</Text>
        );
    }
}