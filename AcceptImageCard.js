import React, { Component } from 'react';
import { View, Text, Button, Image } from 'react-native';

class AcceptImageCard extends Component {
  render() {
    return (
      <View className="AcceptImageCard">
        <Text>{this.props.matchedTerm}</Text>
        <Text>{this.props.trueWidth} x {this.props.trueHeight}</Text>
        <Image className="ImagePreview" src={this.props.sourceLoc} alt="Sample text."/>
      </View>
    )
  }
}

export default AcceptImageCard;
