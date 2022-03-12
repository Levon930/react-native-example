import React from 'react';
import {
  View, TextInput as RNTextInput, LayoutAnimation, TouchableOpacity, Image,
} from 'react-native';
import { Text, Row, Overlay } from '../';
import { red, disabledGrey } from '../../../presentation/styles/colors';
import styles from './styles';

export default class TextInput extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.value) {
      return { text: nextProps.value || '' };
    } else return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      text: props.value || '',
      validation: false,
    };
  }

  focus = () => {
    this.refs.textInput.focus();
  }

  _onFocus = () => {
    this.setState({ focused: true });
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  _onBlur = () => {
    this.setState({ focused: false });
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  _onChangeText = text => {
    this.setState({ text });
    if (this.state.validation) {
      this.trigerValidation();
    }
    LayoutAnimation.easeInEaseOut();
    if (this.props.onChangeText) {
      this.props.onChangeText(text);
    }
  }

  trigerValidation = () => {
    this.setState({ validation: !this.state.validation });
  }

  render() {
    const { placeholder, hint, style, onPress, ...props } = this.props;
    const { text, focused, validation } = this.state;

    return (
      <View style={style}>
        <If condition={!props.withOutTitle && (!!props.title || !!text) && !props.hideTitle}>
          <Text
            caption
            style={[styles.topInputText, { color: validation ? red : disabledGrey }]}
          >
            {props.title || placeholder}
          </Text>
        </If>
        <Row centered>
          <If condition={props.prefix}>
            <Text>
              {props.prefix}
            </Text>
          </If>
          <RNTextInput
            {...props}
            ref="textInput"
            placeholder={placeholder}
            underlineColorAndroid='#0000'
            style={[
              styles.textInput,

              // Vertical alignment isn't supported on iOS, so use this.
              props.multiline ? { paddingTop: 12 } : null,

              props.innerStyle,
              props.lightMode ? { color: 'white' } : { color: 'black' },
            ]}
            onFocus={this._onFocus}
            onBlur={this._onBlur}
            onChangeText={this._onChangeText}
          />
        </Row>
        <If condition={onPress}>
          <Overlay>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={onPress}
            />
          </Overlay>
        </If>
        <If condition={!props.withoutDivider}>
          <View
            // eslint-disable-next-line no-nested-ternary
            style={[{ backgroundColor: validation ?
              red : (focused ? 'rgba(171, 191, 214, 0.5)' : 'rgba(171, 191, 214, 0.5)') }, styles.line]}
          />
        </If>

        <If condition={hint}>
          <Text caption secondary style={{ marginTop: 8 }}>
            {hint}
          </Text>
        </If>
        <If condition={props.rightIcon}>
          <Overlay style={styles.rightIcon}>
            <TouchableOpacity onPress={props.onRightIconPress} style={styles.rightIconContainer}>
              <Image source={props.rightIcon} style={[props.rightIconStyle]} />
            </TouchableOpacity>
          </Overlay>
        </If>
      </View>
    );
  }
}
