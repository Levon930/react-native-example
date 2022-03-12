import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { gradientShadow, white } from '../../../presentation/styles/colors';
import styles from './styles';

export class SearchTopPanel extends React.Component {
  render() {
    const visiblePanelHeight = this.props.panelHeight;
    const borderStyle = this.props.roundedBottom ? styles.roundedBottom : styles.flatBorder;

    return (
      <View
        style={[
          { height: visiblePanelHeight },
          styles.interactable,
          styles.searchTopPanel,
        ]}
      >
        <View style={styles.innerWrap} >
          {this.props.shadow && !this.props.isTransparent &&
            <LinearGradient
              colors={[gradientShadow, 'transparent']}
              style={
                [styles.shadow,
                  borderStyle,
                ]}
            />
          }
          <View
            style={[
              styles.content,
              { backgroundColor: this.props.isTransparent
                ? 'transparent' : this.props.panelColor },
              borderStyle,
            ]}
          >
            {this.props.renderContentView}
          </View>
        </View>
      </View>
    );
  }
}

SearchTopPanel.defaultProps = {
  panelColor: white,
  shadow: true,
  roundedBottom: true,
  panelHeight: 200,
  isTransparent: false,
};
