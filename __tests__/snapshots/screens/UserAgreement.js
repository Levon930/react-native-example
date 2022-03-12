import React from 'react';
import renderer from 'react-test-renderer';
import { UserAgreementScreen } from 'screens';

const navigation = {
  goBack: () => {},
};


it('render UserAgreement screen correctly', () => {
  const tree = renderer.create(
    <UserAgreementScreen navigation={navigation} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
