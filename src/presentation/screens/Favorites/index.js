import React from 'react';
import { observer } from 'mobx-react';
import { View, StatusBar, FlatList, RefreshControl } from 'react-native';
import { LocalizationContext } from 'services';
import * as Colors from 'presentation/styles/colors';
import Toast from 'react-native-easy-toast';
import { FavoriteTypes, AppRoutes } from 'enums';
import { getName, getRouteAbbrev } from 'utils';
import { StopsStore, AllRoutesStore } from 'stores';
import { Row, Divider, RouteListItem, Text } from '../../components';
import { TabItem, StopsListItem } from './components';
import ViewModel from './viewModel';
import styles from './styles';
@observer
export class FavoritesScreen extends React.Component {
  static contextType = LocalizationContext;

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.forceUpdate();
    });
  }

  componentDidUpdate() {
    const { translations } = this.context;
    if (this.viewModel.callToast === true) {
      this.refs.toast.show(
        translations.vehicle.toastCannotTrackMore,
        2000
      );
      this.viewModel.toggleToast();
    }
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  viewModel = new ViewModel(this);

  render() {
    const { translations, appLanguage } = this.context;
    return (
      <View style={styles.safeArea}>
        <StatusBar translucent backgroundColor={Colors.black} barStyle="light-content" />
        <Row style={styles.tabsContainer}>
          <TabItem
            text={translations.favorites.routesTab}
            focused={this.viewModel.activeTab === FavoriteTypes.VEHICLES}
            onPress={() => this.viewModel.setActiveTab(FavoriteTypes.VEHICLES)}
          />
          <TabItem
            text={translations.favorites.stopsTab}
            focused={this.viewModel.activeTab === FavoriteTypes.STOPS}
            onPress={() => this.viewModel.setActiveTab(FavoriteTypes.STOPS)}
          />
        </Row>
        <Choose>
          <When condition={this.viewModel.activeTab === FavoriteTypes.STOPS}>
            <If condition={this.viewModel.stops.length === 0}>
              <Text style={styles.emptyList}>{translations.emptyLists.favoriteStops}</Text>
            </If>
            <FlatList
              data={this.viewModel.stops}
              scrollEventThrottle={20}
              refreshControl={
                <RefreshControl
                  refreshing={this.viewModel.refreshing}
                  onRefresh={this.viewModel.refreshStops}
                />
              }
              renderItem={({ item }) =>
                <StopsListItem
                  name={getName(item, appLanguage)}
                  key={item.id}
                  item={item}
                  onSetFavorite={() => { StopsStore.onSetFavoriteStop(item); this.forceUpdate(); }}
                  isFavorite={StopsStore.isFavorite(item.id)}
                  onPress={() => {
                    this.props.navigation.navigate(AppRoutes.HOME, {
                      stopId: item.id,
                    });
                  }}
                  appLanguage={appLanguage}
                />
              }
              ItemSeparatorComponent={() => (<Divider />)}
            />
          </When>
          <Otherwise>
            <If condition={this.viewModel.routes.length === 0}>
              <Text style={styles.emptyList}>{translations.emptyLists.favoriteRoutes}</Text>
            </If>
            <FlatList
              data={this.viewModel.routes}
              scrollEventThrottle={20}
              refreshControl={
                <RefreshControl
                  refreshing={this.viewModel.refreshing}
                  onRefresh={this.viewModel.refreshRoutes}
                />
              }
              renderItem={({ item }) =>
                <RouteListItem
                  onItemPress={() => {
                    this.props.navigation.navigate(AppRoutes.CHOSEN_ROUTE, {
                      routeItem: item,
                      vehAbbrev: getRouteAbbrev(item.vehicleType, appLanguage),
                      forwardFrom: item.forward.stops.length > 0 && getName(item.forward.stops[0], appLanguage),
                      forwardTo: item.forward.stops.length > 0
                        && getName(item.forward.stops[item.forward.stops.length - 1], appLanguage),
                    });
                  }}
                  type={item.type}
                  forwardFrom={item.forward.stops.length > 0 && getName(item.forward.stops[0], appLanguage)}
                  forwardTo={
                    item.forward.stops.length > 0 &&
                    getName(item.forward.stops[item.forward.stops.length - 1], appLanguage)
                  }
                  vehAbbrev={getRouteAbbrev(item.type, appLanguage)}
                  number={item.number && item.number.trim()}
                  key={item.id}
                  onSubscribe={() => { this.viewModel.onSubscribe(item); this.forceUpdate(); }}
                  onSetFavorite={() => {
                    this.viewModel.onSetFavoriteRoute(item);
                    this.forceUpdate();
                  }}
                  isFollowed={AllRoutesStore.isRouteSubscribed(item.id)}
                  isFavorite={AllRoutesStore.isRouteFavorite(item.id)}
                />
              }
              ItemSeparatorComponent={() => (<Divider />)}
            />
          </Otherwise>
        </Choose>
        <Toast
          ref='toast'
          fadeInDuration={350}
          fadeOutDuration={1000}
          opacity={0.8}
        />
      </View>
    );
  }
}
