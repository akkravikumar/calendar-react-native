import React, {Component, PureComponent} from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Dimensions} from 'react-native'
import {
    format,
} from 'date-fns';
const width = Dimensions.get('window').width;
export default class DateItems extends PureComponent {
    render() {
      const { item, highlight, onItemPress } = this.props;
      const numberOfDates = format(item, 'D');
      const dayName = format(item, 'ddd');
      const highlightBgColor = '#AE9932';
      const normalBgColor = 'white';
      const hightlightTextColor = '#FFFFFF';
      const normalTextColor = '#B1B1B1';
      return (
        <View style={styles.itemContainer}>
          <TouchableOpacity
            underlayColor='#008b8b'
            style={styles.itemWrapButton}
            onPress={onItemPress}>
            <View style={[
              styles.itemView,            
              {backgroundColor: highlight ? highlightBgColor : normalBgColor}
            ]}>
              <View>
                <Text style={[
                    {fontSize:14},
                    {color: highlight ? hightlightTextColor : normalTextColor}
                  ]}>{dayName.toUpperCase()}</Text>
                </View>
                  <Text style={[
                    styles.itemDateText,
                    {color: highlight ? hightlightTextColor : normalTextColor}
                  ]}>{numberOfDates}</Text>        
              </View>
          </TouchableOpacity>
        </View>
      );
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        width: width / 7,
        height: 60,
        borderBottomWidth: 5,
        borderBottomColor: 'rgba(100,100,100,0.1)',
      }, 
      itemView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 10,
        borderWidth: 5,
        borderColor: 'transparent'
      },
      itemDateText: {
        fontSize: 16,
        lineHeight: 15,
        marginTop: 5
      },
});
