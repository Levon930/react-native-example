import React, { Component } from 'react';
import { View, Animated, TextInput } from 'react-native';
import { string, func, object, number } from 'prop-types';
import * as Colors from '../../../presentation/styles/colors';
import styles from './styles';

export class FloatingTitleTextInputField extends Component {
  static propTypes = {
    attrName: string.isRequired,
    title: string.isRequired,
    value: string.isRequired,
    updateMasterState: func.isRequired,
    keyboardType: string,
    titleActiveSize: number, // to control size of title when field is active
    titleInActiveSize: number, // to control size of title when field is inactive
    titleActiveColor: string, // to control color of title when field is active
    titleInactiveColor: string, // to control color of title when field is active
    textInputStyles: object,
    otherTextInputProps: object,
  }

  static defaultProps = {
    keyboardType: 'default',
    titleActiveSize: 11.5,
    titleInActiveSize: 15,
    titleActiveColor: Colors.titleGrey,
    titleInactiveColor: Colors.titleGrey,
    textInputStyles: {},
    otherTextInputAttributes: {},
  }

  constructor(props) {
    super(props);
    const { value } = this.props;
    this.position = new Animated.Value(value ? 1 : 0);

    this.state = {
      isFieldActive: false,
    };
  }

  _handleFocus = () => {
    if (!this.state.isFieldActive) {
      this.setState({ isFieldActive: true });
      this._animateLabelUp();
    }
  }

  _handleBlur = () => {
    if (this.state.isFieldActive && !this.props.value) {
      this.setState({ isFieldActive: false });
      this._animateLabelDown();
    }
  }

  _onChangeText = (updatedValue) => {
    const { attrName, updateMasterState } = this.props;
    updateMasterState(attrName, updatedValue);
    if (updatedValue === '') {
      this._handleBlur();
    } else {
      this._handleFocus();
    }
  }

  _animateLabelDown = () => {
    Animated.timing(this.position, {
      toValue: 0,
      duration: 150,
    }).start();
  }

  _animateLabelUp= () => {
    Animated.timing(this.position, {
      toValue: 1,
      duration: 150,
    }).start();
  }

  _returnAnimatedTitleStyles = () => {
    const { isFieldActive } = this.state;
    const {
      titleActiveColor, titleInactiveColor, titleActiveSize, titleInActiveSize,
    } = this.props;

    return {
      top: this.position.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 0],
      }),
      fontSize: isFieldActive ? titleActiveSize : titleInActiveSize,
      color: isFieldActive ? titleActiveColor : titleInactiveColor,
    };
  }

  animateAfterSwap = (_, blur) => {
    if (blur) {
      this.setState({ isFieldActive: false });
      this._animateLabelDown();
    } else {
      this._handleFocus();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.Text
          style={[styles.titleStyles, this._returnAnimatedTitleStyles()]}
        >
          {this.props.title}
        </Animated.Text>
        <TextInput
          value={this.props.value}
          style={[styles.textInput, this.props.textInputStyles]}
          underlineColorAndroid='transparent'
          onFocus={this._handleFocus}
          onBlur={this._handleBlur}
          onChangeText={this._onChangeText}
          keyboardType={this.props.keyboardType}
          {...this.props.otherTextInputProps}
        />
      </View>
    );
  }
}
