import { observable, action } from 'mobx';
import { Platform } from 'react-native';
import { check, request, RESULTS, PERMISSIONS } from 'react-native-permissions';
import { DeviceType, PermissionTypes } from 'enums';

export default class PermissionsStore {

  @observable
  statuses = new Map();

  @action
  requestPermission(permName, grantedCallback, blockedCallback) {
    let permission;

    switch (permName) {
      case PermissionTypes.LOCATION:
        permission = Platform.OS === DeviceType.IOS ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        break;
      default:
        break;
    }

    try {
      check(permission).then(result => {
        //case 1 denied, make request
        if (result === RESULTS.DENIED) {
          request(permission).then(response => {
            this.statuses.set(permission, response);
            
            if (response === RESULTS.GRANTED) {
              grantedCallback();
            }
          });
        //case 2 granted, execute grantedCallback
        } else if (result === RESULTS.GRANTED) {
          grantedCallback();
        //case 3 blocked, cannot request permission anymore
        } else {
          blockedCallback();
        }
      });

    } catch (error) {

    }
  }
}
