/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import 'react-native';
import React from 'react';
import App from '../App';
import CalendarStrip from '../library/CalendarStrip'
import { shallow } from 'enzyme';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<App />);
});

test('renders correctly', () =>{
  const tree = renderer.create(<App/>).toJSON();
  expect(tree).toMatchSnapshot();
});

it("should render without issues", () => {
  const component = shallow(
    <CalendarStrip
      selectedDate = {new Date()}
      onPressDate={(date) => {
        console.log('date', date);
      }}
    />
  );
  expect(component.length).toBe(1);
  expect(toJson(component)).toMatchSnapshot();
});