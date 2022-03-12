import PermissionsStore from './PermissionsStore';
import AllRoutesStore from './AllRoutesStore';
import StopsStore from './StopsStore';
import PushNotificationsStore from './PushNotificationsStore';
import TipsStore from './TipsStore';

class RootStore {
  permissionsStore = new PermissionsStore();
  stopsStore = new StopsStore();
  allRoutesStore = new AllRoutesStore();
  pushNotificationsStore = new PushNotificationsStore(this);
  tipsStore = new TipsStore();
}

const rootStore = new RootStore();

module.exports = {
  PermissionsStore: rootStore.permissionsStore,
  StopsStore: rootStore.stopsStore,
  AllRoutesStore: rootStore.allRoutesStore,
  PushNotificationsStore: rootStore.pushNotificationsStore,
  TipsStore: rootStore.tipsStore,
};
