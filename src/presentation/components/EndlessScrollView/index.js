import React from 'react';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

const PAGE_END_THRESHOLD = 1000;

export default class EndlessScrollView extends React.Component {

  _maximalReachedOffset;

  _onLayout = event => {
    const currentHeight = event.nativeEvent.height;
    if (currentHeight < PAGE_END_THRESHOLD) {
      this._maximalReachedOffset = currentHeight;
      this.props.onFetchNextPage();
    }
  }

  _onScroll = event => {
    const { contentSize, contentOffset, layoutMeasurement } = event.nativeEvent;
    const contentLength = contentSize.height;
    if (contentLength !== this._maximalReachedOffset) {
      const offset = contentOffset.y;
      const visibleLength = layoutMeasurement.height;
      const distanceFromEnd = contentLength - visibleLength - offset;
      if (distanceFromEnd < PAGE_END_THRESHOLD) {
        this._maximalReachedOffset = contentLength;
        this._notifyOnFetchNextPage();
      }
    }
    this._notifyOnScroll(event);
  }

  _notifyOnScroll(event) {
    if (this.props.onScroll) {
      this.props.onScroll(event);
    }
  }

  _notifyOnFetchNextPage() {
    if (this.props.onFetchNextPage) {
      this.props.onFetchNextPage();
    }
  }

  scrollTo(position) {
    this.refs.scrollView.scrollTo({ y: position, animated: false });
  }

  render() {
    return (
      <InvertibleScrollView
        showsVerticalScrollIndicator={false}
        onScroll={this._onScroll}
        onLayout={this._onLayout}
        scrollEventThrottle={0}
        keyboardDismissMode="on-drag"
        ref='scrollView'
        {...this.props}
      >
        {this.props.children}
      </InvertibleScrollView>
    );
  }
}
