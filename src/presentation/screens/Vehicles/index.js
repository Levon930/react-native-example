import React from 'react';
import { View, StatusBar, FlatList } from 'react-native';
import { Row, LoaderView, Button, SearchInput, Text } from 'components';
import { observer } from 'mobx-react';
import { getRouteAbbrev, getName } from 'utils';
import { LocalizationContext } from 'services';
import * as Colors from 'presentation/styles/colors';
import Toast from 'react-native-easy-toast';
import { VehicleTypes, AppRoutes, EmptyListMessageType } from 'enums';
import * as Assets from 'assets';
import { TabBar } from './components';
import ViewModel from './viewModel';
import styles from './styles';

@observer
export class VehiclesScreen extends React.Component {
  static contextType = LocalizationContext;

  componentDidUpdate() {
    const { translations } = this.context;
    if (this.viewModel.callToast === true) {
      this.refs.toastRef.show(
        translations.vehicle.toastCannotTrackMore,
        2000
      );
      this.viewModel.toggleToast();
    }
  }

  onTabPress = (tab) => {
    if (this.viewModel.routesToDisplay.length !== 0 && this.refs.flatListRef) {
      this.refs.flatListRef.scrollToIndex({ animated: false, index: 0 });
    }

    this.viewModel.setActiveTab(tab);
  }

  viewModel = new ViewModel(this);

  renderListItem = ({ item }) => {
    const { appLanguage } = this.context;
    const abbreviation = getRouteAbbrev(item.type, appLanguage);
    let title = `${abbreviation} ${item.number}`;
    if (title.length > 7) title = title.slice(0, 7) + '...';
    return (
      <Button
        key={item.id}
        style={styles.listItem}
        title={title}
        onPress={() => {
          this.props.navigation.navigate(AppRoutes.CHOSEN_ROUTE, {
            routeid: item.id,
            routeItem: item,
            vehAbbrev: abbreviation,
            forwardFrom: item.startStop && getName(item.startStop, appLanguage),
            forwardTo: item.endStop && getName(item.endStop, appLanguage),
          });
        }}
      />
    );
  }

  renderEmptyContainer = () => {
    const { translations } = this.context;
    return (
      <Text style={styles.emptyList}>
        {this.viewModel.emptyListMessageType === EmptyListMessageType.SEARCH ?
          translations.emptyLists.vehiclesSearch : translations.emptyLists.routes}</Text>
    );
  }

  render() {
    const { translations } = this.context;
    return (
      <View style={styles.safeArea}>
        <StatusBar translucent backgroundColor={Colors.black} barStyle="light-content" />
        <View style={{ flex: 1 }}>
          <Row style={styles.tabsContainer}>
            <TabBar
              imageStyle={{width: 23, height: 40}}
              focusedColor='#E5312E'
              source={Assets.tramIcon}
              text={translations.vehicle.tram}
              focused={this.viewModel.activeTab === VehicleTypes.TRAM}
              onPress={() => this.onTabPress(VehicleTypes.TRAM)}
            />
            <TabBar
              imageStyle={{width: 23, height: 36}}
              focusedColor='#00ADE5'
              source={Assets.trolleybusIcon}
              text={translations.vehicle.trolleybus}
              focused={this.viewModel.activeTab === VehicleTypes.TROLLEYBUS}
              onPress={() => this.onTabPress(VehicleTypes.TROLLEYBUS)}
            />
            <TabBar
              imageStyle={{width: 33, height: 27}}
              focusedColor='#F99A1C'
              source={Assets.busLightIcon}
              text={translations.vehicle.bus}
              focused={this.viewModel.activeTab === VehicleTypes.BUS}
              onPress={() => this.onTabPress(VehicleTypes.BUS)}
            />
            <TabBar
              imageStyle={{width: 32, height: 32}}
              focusedColor='#204CA3'
              source={Assets.metroIcon}
              text={translations.vehicle.metro}
              focused={this.viewModel.activeTab === VehicleTypes.METRO}
              onPress={() => this.onTabPress(VehicleTypes.METRO)}
            />
          </Row>
          <Choose>
            <When condition={this.viewModel.loading}>
              <LoaderView />
            </When>
            <Otherwise>
              <SearchInput
                value={this.viewModel.searchValue}
                onChangeText={this.viewModel.setSearchValue}
                onRightIconPress={this.viewModel.clearSearchResult}
                onSubmit={this.viewModel.onSubmitSearch}
                submitText={translations.general.search}
              />
              <FlatList
                data={this.viewModel.routesToDisplay}
                scrollEventThrottle={50}
                contentContainerStyle={styles.listContainer}
                numColumns={4}
                ref='flatListRef'
                renderItem={this.renderListItem}
                ListEmptyComponent={this.renderEmptyContainer()}
                // Performance settings
                initialNumToRender={5} // Reduce initial render amount
                maxToRenderPerBatch={1} // Reduce number in each render batch
              />
            </Otherwise>
          </Choose>
        </View>
        <Toast
          ref='toastRef'
          style={styles.toast}
          fadeInDuration={350}
          fadeOutDuration={1000}
          opacity={0.8}
          positionValue={150}
        />
      </View>
    );
  }
}

export default VehiclesScreen;
