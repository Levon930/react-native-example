
import React from 'react';
import renderer from 'react-test-renderer';
import { TogglingStops, StopItem } from 'components';

const stop = {
  index: 0,
  id: '5e7f2e7115ad5b4c0414426c',
  isStart: true,
  nameEN: 'Залізничний вокзал',
  nameRU: 'Залізничний вокзал',
  nameUA: 'Залізничний вокзал',
  number: 48207,
  geolocation: { latitude: 49.835381, longitude: 23.995241 },
};

const mockTrackedRouteData = [
  {
    gpsStatus: true,
    id: '5e7f2e8015ad5b4c0414428b',
    isSuburban: false,
    length: 0,
    costMoving: 7,
    startHour: '2020-03-28T11:01:20.561Z',
    endHour: '2020-03-28T12:01:20.561Z',
    number: '1',
    tempRoute: false,
    type: 0,
    forward: {
      pathId: '5e7f2e8015ad5b4c04144287',
      geolocation: [
        { id: 0, latitude: 48.475866446966, longitude: 35.015351474285 },
      ],
      stops: [
        stop,
      ],
    },
    backward: {
      pathId: '4_25634758',
      geolocation: [
        { id: 1011, latitude: 49.835443, longitude: 23.995359 },
      ],
      stops: [
        {
          index: 0,
          id: '5e7f2e7915ad5b4c0414427b',
          isStart: true,
          nameEN: 'Транспортний університет',
          nameRU: 'Транспортний університет',
          nameUA: 'Транспортний університет',
          number: 48207,
          geolocation: { latitude: 48.438530429539, longitude: 35.05035007 },
        },
      ],
    },
  },
];

test('TogglingStops render correctly', () => {

  const renderStopView = () => {};
  const onStopPress = () => {};
  const renderStartStopFlag = () => null;
  const renderEndStopFlag = () => null;

  const tree = renderer.create(
    <TogglingStops
      routesDataSet={mockTrackedRouteData}
      showSelectRouteOnly
      zoomThreadhold={15}
      renderStartStopFlag={renderStartStopFlag}
      regionToReactTo={{}}
      routeIdToReactTo={''}
      renderStopView={renderStopView}
      renderEndStopFlag={renderEndStopFlag}
      onStopPress={onStopPress}
    />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('Stop general component render correctly', () => {

  const tree = renderer.create(
    <StopItem
      item={stop}
      index={stop.index}
      onPress={() => {}}
    />).toJSON();
  expect(tree).toMatchSnapshot();
});
