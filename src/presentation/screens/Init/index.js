import React from 'react';
import { AppRoutes } from 'enums';
import { resetInitRouteAndNavigate } from 'navigation';
import { LocalizationContext } from 'services';
import { observer } from 'mobx-react';
import { LoaderView } from 'components';
import { StopsStore, AllRoutesStore } from '../../../stores';
import ViewModel from './viewModel';

@observer
export class InitScreen extends React.Component {
  static contextType = LocalizationContext;

  constructor(props) {
    super(props);
    StopsStore.setStops();
    AllRoutesStore.setRoutesIsVisibleSuburban();
  }

  async componentDidMount() {
    await this.context.initializeAppLanguage();
    this.viewModel.setLaunchStatus(this.computeRoute, this.context.appLanguage);
  }

  viewModel = new ViewModel(this);

  computeRoute = () => {
    const routeName = this.viewModel.isFirstLaunch === (true).toString()
      ? AppRoutes.ONBOARDING : AppRoutes.HOME;
    setTimeout(() => resetInitRouteAndNavigate(routeName, this.props.navigation, null), 3000);
  }

  render() {
    const { initializeAppLanguage } = this.context;
    initializeAppLanguage();
    return (
      <LoaderView />
    );
  }
}
