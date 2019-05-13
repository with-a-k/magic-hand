import React, { Component } from 'react';
import { Dimensions, View, Text, Button } from 'react-native';
import SideSwipe from 'react-native-sideswipe';
import Expo from 'expo';

import KeywordView from './KeywordView';
import secrets from './secrets';
import styles from './Stylesheets';

let screenHeight = Dimensions.get('window').height;

const {manifest} = Expo.Constants;
const api = (typeof manifest.packagerOpts === 'object') && manifest.packagerOpts.dev
  ? manifest.debuggerhost
  : 'production value'

class KeywordsView extends Component {
  state = {
    keywords: [],
    currentId: 0,
    currentIndex: 0
  }

  async getInstagramUserFeed(username) {
    let response = await fetch(`https://10.10.10.29:5000/search/instagram/user/${username}`)
                                .then((response) => response.json());
    console.log(response);
    return response.map(function(item) {
      return {
        sourceLoc: item.sourceLoc,
        width: item.width,
        height: item.height,
        matchedTerm: `Instagram User - ${username}`
      }
    });
  }

  async getInstagramTagFeed(tag) {
    let response = await fetch(`https://10.10.10.29:5000/search/instagram/tag/${tag}`)
                                .then((response) => response.json());

    return response.map(function(item) {
      return {
        sourceLoc: item.sourceLoc,
        width: item.width,
        height: item.height,
        matchedTerm: `Instagram Tag - ${tag}`
      }
    });
  }
  async googleImageSubsearch(index, keyword) {
    return await fetch(`https://www.googleapis.com/customsearch/v1?key=${secrets.key}&cx=${secrets.cx}&q=${keyword}&start=${index}&searchType=image`)
                          .then((response) => response.json());
  }

  async googleImageSearch(keyword) {
    let promises = [1, 11, 21, 31, 41, 51, 61, 71, 81, 91].map(function(i) {
      return this.googleImageSubsearch(i, keyword)
    }, this)
    let results = Promise.all(promises).then(function (responses) {
      return responses.reduce(function(collection, response) {
        return collection.concat(response.items);
      }, []);
    });

    return results.then(function (results) {return results.map(function(item) {
      return {
        sourceLoc: item.link,
        width: item.image.width,
        height: item.image.height,
        matchedTerm: `Google Image Search - ${keyword}`
      };
    })});
  }

  async googleImageScrape(keyword) {
    let response = await fetch(`https://10.10.10.29:5000/search/google/${keyword}`)
                                .then((response) => response.json());

    return response.items.map(function(item) {
      return {
        sourceLoc: item.sourceLoc,
        width: item.width,
        height: item.height,
        matchedTerm: `Google Image Search - ${keyword}`
      }
    });
  }

  async getWebsiteImages(site) {
    let response = await fetch('https://10.10.10.29:5000/search/website/', {
      method: 'POST',
      body: JSON.stringify({
        url: site
      }),
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => response.json());
    return response.map(function(item) {
      return {
        sourceLoc: item.sourceLoc,
        width: '???',
        height: '???',
        matchedTerm: `Website - ${site}`
      }
    });
  }

  addKeyword() {
    this.setState((state) => {
      const keyword = { id: this.state.currentId, type: 'gisearch', word: '' };
      return {
        currentId: state.currentId + 1,
        keywords: [...state.keywords, keyword],
      };
    });
  }

  changeKeyword(id, type, word) {
    this.setState((prevState) => {
      const changedWord = { id: id, type: type, word: word };
      return {
        keywords: prevState.keywords.map(function(oldWord) {
          return oldWord.id === id ? changedWord : oldWord;
        })
      }
    });
  }

  removeKeyword(id) {
    this.setState((prevState) => {
      return {
        keywords: prevState.keywords.filter(function(keyword) {
          return keyword.id !== id;
        })
      }
    });
  }

  async remoteTest() {
    fetch('https://10.10.10.29:5000/test', {
      method: 'GET',
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    });
  }

  async submitSearch() {
    let results = {
      images: [

      ]
    };
    const googleImageSearch = this.googleImageSearch.bind(this);
    const getInstagramUserFeed = this.getInstagramUserFeed;
    const getInstagramTagFeed = this.getInstagramTagFeed;
    const getWebsiteImages = this.getWebsiteImages;

    let gisWords = this.state.keywords.filter((word => word.type === 'gisearch'));
    let instagramUsers = this.state.keywords.filter((word) => word.type === 'instauser');
    let instagramTags = this.state.keywords.filter((word) => word.type === 'instatag');
    let websites = this.state.keywords.filter((word) => word.type === 'website');
    let gisResults = await gisWords.reduce(async function(results, keyword) {
      return results.concat(await googleImageSearch(keyword.word));
    }, []);
    let inuResults = await instagramUsers.reduce(async function(results, username) {
      return results.concat(await getInstagramUserFeed(username.word));
    }, []);
    let intResults = await instagramTags.reduce(async function(results, tag) {
      return results.concat(await getInstagramTagFeed(tag.word));
    }, []);
    let webResults = await websites.reduce(async function(results, site) {
      return results.concat(await getWebsiteImages(site));
    }, []);
    results.images = results.images.concat(gisResults).concat(inuResults).concat(intResults).concat(webResults);
    fetch(`https://10.10.10.29:5000/query`, {
      method: 'POST',
      body: JSON.stringify({
        images: results.images,
        email: this.props.email
      }),
      headers: {
        'content-type': 'application/json'
      }
    });
  }

  render() {
    let changeKeyword = this.changeKeyword.bind(this);
    let removeKeyword = this.removeKeyword.bind(this);
    let { width } = Dimensions.get('window');
    let cardOffset = 0;
    return (
      <View className="KeywordsView" style={styles.toplevelContainerView}>
        <SideSwipe
          index = {this.state.currentIndex}
          itemWidth = {width}
          style = {{width}, {height: screenHeight - 150}}
          contentOffset = {cardOffset}
          data = {this.state.keywords}
          extractKey = {(item, index) =>
            item.id.toString()
          }
          threshold = {50}
          useVelocityForIndex = {false}
          onIndexChange = {index => {
              if (this.state.keywords.length === 0) return;
              this.setState(() => ({currentIndex: index}))
            }
          }
          renderItem={({ itemIndex, currentIndex, item, animatedValue }) => (
            <KeywordView
              {...item}
              index={itemIndex}
              currentIndex={currentIndex}
              animatedValue={animatedValue}
              handleChange={changeKeyword}
              removeKeyword={removeKeyword}
            />
          )}
        />
        <View className="SearchKeywordsControls" style={styles.horizontalControl}>
          <Button className="SearchKeywordsButton AddKeyword" onPress={this.addKeyword.bind(this)} title="Add Keyword"></Button>
          <Button className="SearchKeywordsButton BeginSearch" onPress={this.submitSearch.bind(this)} title="Begin Search"></Button>
        </View>
      </View>
    )
  }
}

export default KeywordsView;
