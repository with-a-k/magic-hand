import React, { Component } from 'react';
import { Dimensions, View, Text, Button, Picker, TextInput } from 'react-native';
import t from 'tcomb-form-native';
import styles from './Stylesheets';

let Form = t.form.Form;

let KeywordType = t.enums({
  GIS: 'Google Image Search',
  IUP: 'Instagram Profile',
  IHT: 'Instagram Hashtag',
  URL: 'Website by URL'
})

let Keyword = t.struct({
  word: t.String,
  type: KeywordType,
})

const width = Dimensions.get('window').width;

class KeywordView extends Component {
  constructor(props) {
    super(props);
  }

  statics: {
    typemap: {
      "gisearch": "search",
      "instauser": "user",
      "instatag": "hashtag",
      "website": "globe"
    }
  }

  handleSelectChange(itemValue, itemPosition) {
    this.props.handleChange(this.props.id, itemValue, this.props.word);
  }

  handleTextChange(text) {
    this.props.handleChange(this.props.id, this.props.type, text);
  }

  handleClickRemove() {
    this.props.removeKeyword(this.props.id);
  }

  render() {
    return (
      <View className="KeywordField" style={styles.card}>
        <Picker selectedValue={this.props.type}
          onValueChange={this.handleSelectChange.bind(this)}
          style={styles.picker}
          itemStyle={styles.pickerItem}>
          <Picker.Item label="Google Image Search" value="gisearch"/>
          <Picker.Item label="Instagram User" value="instauser"/>
          <Picker.Item label="Instagram Tag" value="instatag"/>
          <Picker.Item label="Website" value="website"/>
        </Picker>
        <View className="keywordInputGrouper">
          <TextInput type="text"
            style={styles.textinput}
            value={this.props.word}
            onChangeText={this.handleTextChange.bind(this)}
            placeholder="Enter a keyword..."/>
        </View>
        <Button onPress={this.handleClickRemove.bind(this)} title="Remove Keyword"/>
      </View>
    )
  }
}

export default KeywordView;
