import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import {
  addDays,
  subDays,
  eachDay,
  isFuture,
  isSameDay,
  endOfWeek,
  startOfWeek,
  differenceInDays,
} from 'date-fns';
import DataItems from './DataItem'
const width = Dimensions.get('window').width;
const ITEM_LENGTH = width / 7;
const _today = new Date();
const _year = _today.getFullYear();
const _month = _today.getMonth();
const _day = _today.getDate();
const TODAY = new Date(_year, _month, _day); // FORMAT: Fri Feb 16 2019 00:00:00 GMT+0800 (CST)

class CalendarStrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: this.getInitialDates(),
      isTodayVisible: true,
      pageOfToday: 2, // page of today in calendar, start from 0
      currentPage: 2, // current page in calendar,  start from 0
    };
  }

  componentWillMount() {
    const touchThreshold = 50;
    const speedThreshold = 0.2;
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dy, vy } = gestureState; // dy - accumulated distance of the gesture since the touch started, vy - current velocity of the gesture
        if (dy > touchThreshold && vy > speedThreshold) {
          const { onSwipeDown } = this.props;
          onSwipeDown && onSwipeDown();
        }
        return false;
      },
      onPanResponderRelease: () => {},
    });
  }

  componentWillReceiveProps(nextProps) {
    if (isSameDay(nextProps.selectedDate, this.props.selectedDate)) return;
    const nextSelectedDate = nextProps.selectedDate;
    if (!this.currentPageDatesIncludes(nextSelectedDate)) {
      const sameDay = (d) => isSameDay(d, nextSelectedDate);
      if (this.state.datas.find(sameDay)) {
        let selectedIndex = this.state.datas.findIndex(sameDay);
        if (selectedIndex === -1) selectedIndex = this.state.pageOfToday; // in case not find
        const selectedPage = ~~(selectedIndex / 7);
        this.scrollToPage(selectedPage);
      } else {
        if (isFuture(nextSelectedDate)) {
          const head = this.state.datas[0];
          const tail = endOfWeek(nextSelectedDate);
          const days = eachDay(head, tail);
          this.setState({
            datas: days,
            isTodayVisible: false,
          }, () => {
            const page = ~~(days.length/7 - 1);
            this.scrollToPage(page);
          });
        } else {
          const head = startOfWeek(nextSelectedDate);
          const tail = this.state.datas[this.state.datas.length - 1];
          const days = eachDay(head, tail);
          this.setState({
            datas: days,
            isTodayVisible: false,
          }, () => {
            // to first page
            this.scrollToPage(0);
          });
        }
      }
    }
  }

  scrollToPage = (page, animated=true) => {
    this._calendar.scrollToIndex({ animated, index: 7 * page });
  }

  currentPageDatesIncludes = (date) => {
    const { currentPage } = this.state;
    const currentPageDates = this.state.datas.slice(7*currentPage, 7*(currentPage+1));
    // dont use currentPageDates.includes(date); because can't compare Date in it
    return !!currentPageDates.find(d => isSameDay(d, date));
  }

  getInitialDates() {
    // const todayInWeek = getDay(TODAY);
    const last2WeekOfToday = subDays(TODAY, 7 * 2);
    const next2WeekOfToday = addDays(TODAY, 7 * 2);
    const startLast2Week = startOfWeek(last2WeekOfToday);
    const endNext2Week = endOfWeek(next2WeekOfToday);
    const eachDays = eachDay(startLast2Week, endNext2Week);
    return eachDays;
  }

  loadNextTwoWeek(originalDates) {
    const originalFirstDate = originalDates[0];
    const originalLastDate = originalDates[originalDates.length-1];
    const lastDayOfNext2Week = addDays(originalLastDate, 7 * 2);
    const eachDays = eachDay(originalFirstDate, lastDayOfNext2Week);
    this.setState({ datas: eachDays });
  }

  loadPreviousTwoWeek(originalDates) {
    const originalFirstDate = originalDates[0];
    const originalLastDate = originalDates[originalDates.length-1];
    const firstDayOfPrevious2Week = subDays(originalFirstDate, 7 * 2);
    const eachDays = eachDay(firstDayOfPrevious2Week, originalLastDate);
    this.setState(prevState => ({
      datas: eachDays,
      currentPage: prevState.currentPage+2,
      pageOfToday: prevState.pageOfToday+2,
    }), () => {
      this.scrollToPage(2, false);
    });
  }

  _renderHeader = () => {
    const { selectedDate, onPressGoToday} = this.props;
    var dateFormat = require('dateformat');
    var moment = require('moment');

    let pMonth = selectedDate;
    pMonth = moment(pMonth).subtract(1, 'month');
    const previousMonth = dateFormat(pMonth, "mmm");

    let nMonth = selectedDate;
    nMonth = moment(nMonth).add(1, 'month');
    const nextMonth = dateFormat(nMonth, "mmm");
    const currentMonth = dateFormat(selectedDate, "mmm");

    return (
      <View style={styles.header}>
        <TouchableOpacity style={{marginRight:50}} onPress={() => {
         const page = 4;
          onPressGoToday && onPressGoToday(pMonth);
          this.scrollToPage(page);
        }}>
          <Text style={{fontSize:14, color: '#CACACA'}}>{previousMonth}</Text>
        </TouchableOpacity>
        <Text style={{fontSize:14, color: '#000000', fontWeight: 'bold'}}>{currentMonth}</Text>
        <TouchableOpacity style={{marginLeft:50}} onPress={() => {
         const page = 4;
          onPressGoToday && onPressGoToday(nMonth);
          this.scrollToPage(page);
        }}>
          <Text style={{fontSize:14, color: '#CACACA'}}>{nextMonth}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _stringToDate = (dateString) => {
    // '2019-02-15' => Date
    const dateArr = dateString.split('-');
    const [y, m, d] = dateArr.map(ds => parseInt(ds, 10));
    // CAVEAT: Feb is 0
    return new Date(y, m-1, d);
  }

  render() {
    const {
      onPressDate,
      selectedDate,
    } = this.props;
    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
        {this._renderHeader()}
        <View>
        <FlatList
          ref={ref => this._calendar = ref}
          bounces={false}
          horizontal
          pagingEnabled
          initialScrollIndex={14}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={this.momentumEnd}
          scrollEventThrottle={500}
          getItemLayout={(data, index) => (
            {length: ITEM_LENGTH, offset: ITEM_LENGTH * index, index}
          )}
          onEndReached={() => { this.onEndReached(); } }
          onEndReachedThreshold={0.01}
          data={this.state.datas}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) =>
            <DataItems
              item={item}
              onItemPress={() => onPressDate && onPressDate(item)}
              highlight={isSameDay(selectedDate, item)}
              currentDate={selectedDate}
            />}
        /></View>
      </View>
    );
  }

  momentumEnd = (event) => {
    const firstDayInCalendar = this.state.datas ? this.state.datas[0] : new Date();
    const daysBeforeToday = differenceInDays(firstDayInCalendar, new Date());
    const pageOfToday = ~~(Math.abs(daysBeforeToday / 7));
    const screenWidth = event.nativeEvent.layoutMeasurement.width;
    const currentPage = event.nativeEvent.contentOffset.x / screenWidth;
    this.setState({
      pageOfToday,
      currentPage,
      isTodayVisible: currentPage === pageOfToday,
    });

    // swipe to head ~ load 2 weeks
    if (event.nativeEvent.contentOffset.x < width) {
      this.loadPreviousTwoWeek(this.state.datas);
    }
  }

  onEndReached() {
    this.loadNextTwoWeek(this.state.datas);
  }
}

CalendarStrip.propTypes = {
  selectedDate: PropTypes.object.isRequired,
  onPressDate: PropTypes.func,
  onPressGoToday: PropTypes.func,
};


const styles = StyleSheet.create({
  container: {
    width,
    height: 30+30+50,
  },
  header: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerDate: {
    color: 'gray',
    fontSize: 13,
  },
  headerDateWeek: {
    color: '#3D6DCF',
    fontSize: 14,
  },
  headerGoTodayButton: {
    borderRadius: 10,
    width: 20, height: 20,
    backgroundColor: '#3D6DCF',
    position: 'absolute', top: 5, right: 50,
    justifyContent: 'center', alignItems: 'center',
  },
  todayText: {
    fontSize: 12,
    color: 'white',
  },
  itemContainer: {
    width: width / 7,
    height: 60,
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(100,100,100,0.1)',
  },
  itemWrapButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  itemLunarText: {
    fontSize: 10,
  },
  itemBottomDot: {
    width: 4,
    left: 20,
    height: 4,
    bottom: 4,
    borderRadius: 2,
    position: 'absolute',
  }
});

export default CalendarStrip;
