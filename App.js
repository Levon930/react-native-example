/**
 * @format
 * @flow
 */
import {wrap} from 'lodash';
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from 'enums';
import { LocalizationProvider } from 'services';
import { observer } from 'mobx-react';
import {AppNavigator} from './src/presentation/navigation';
import {Text, TextInput} from "react-native";

console.ignoredYellowBox = [
  'Warning: Navigator',
  'Warning: Overriding',
  'Remote',
  'Task',
  'Native TextInput',
  'Require cycle:',
  'RCTRootView cancelTouches',
  'We found non-serializable values',
];

@observer
class App extends React.Component {

  componentDidMount() {
    Text.render = wrap(Text.render, function (func, ...args) {
      const originText = func.apply(this, args)
      return React.cloneElement(originText, {
        style: [
          {fontFamily: 'DniproOpen'},
          originText.props.style,
        ],
      })
    })
    TextInput.render = wrap(TextInput.render, function (func, ...args) {
      const originTextInput = func.apply(this, args)
      return React.cloneElement(originTextInput, {
        style: [
          { fontFamily: 'DniproOpen' },
          originTextInput.props.style,
        ],
      })
    })
  }
  render() {
    return (
      <LocalizationProvider>
        <NavigationContainer>
          <AppNavigator
            initialRouteName={AppRoutes.INIT}
          />
        </NavigationContainer>
      </LocalizationProvider>
    );
  }
}

export default App;
