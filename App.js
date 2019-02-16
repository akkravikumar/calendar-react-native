/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, AppRegistry} from 'react-native';
import CalendarStrip from './library/CalendarStrip'


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
    };
  }
  render() {
    return (
      <View style={{marginTop: 50}}>
        <CalendarStrip
          selectedDate={this.state.selectedDate}
          onPressDate={(date) => {
            this.setState({ selectedDate: date });
          }}
          onPressGoToday={(today) => {
            this.setState({ selectedDate: today });
          }}
        />
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });
