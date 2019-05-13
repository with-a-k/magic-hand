import download from 'downloadjs';
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import AcceptImageCard from './AcceptImageCard';

class AcceptView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      candidates: []
    }
  }

  componentDidMount() {
    //this.loadData(this.state.galleryId);
  }

  async loadData(galleryId) {
    // replace that direct link with a config variable later
    const rawResponse = await fetch(`http://localhost:5000/query/${galleryId}`);
    let rawCards = await rawResponse.json();
    this.setState({candidates: rawCards.images.map(function(image, index) {
      return {
        id: index,
        sourceLoc: image.sourceLoc,
        matchedTerm: image.matchedTerm,
        height: image.height,
        width: image.width,
        accepted: false
      };
    })});
  }

  toggleApproval(event) {
    let candidates = this.state.candidates;
    candidates = candidates.map(function(cand) {
      if (`toggle-candidate-${cand.id}` === event.target.id) {
        let candidateStatus = !cand.accepted;
        return {
          id: cand.id,
          sourceLoc: cand.sourceLoc,
          matchedTerm: cand.matchedTerm,
          height: cand.height,
          width: cand.width,
          accepted: candidateStatus
        }
      } else {
        return cand;
      }
    });
    this.setState({candidates: candidates});
  }

  regenerateCards() {
    const toggleApprovalProp = this.toggleApproval.bind(this);
    return this.state.candidates.map(function(cand, index) {
      return (<AcceptImageCard
        key = {index}
        candId = {cand.id}
        sourceLoc = {cand.sourceLoc}
        matchedTerm = {cand.matchedTerm}
        trueWidth = {cand.width}
        trueHeight = {cand.height}
        toggleApproval = {toggleApprovalProp}
        accepted = {cand.accepted}
      />)
    });
  }

  async finishApproval() {
    let approved = this.state.candidates.filter((cand) => cand.accepted).map((cand) => cand.sourceLoc);
    fetch(`http://localhost:5000/finish/${this.state.galleryId}`, {
      method: 'POST',
      body: JSON.stringify({
        targets: approved
      }),
      headers: {
        'content-type': 'application/json'
      }
    }).then(function(response) {
      response.blob().then((blob) => {
        download(blob, 'gallery.zip', 'application/zip');
      });
    });
  }

  render() {
    let AcceptCards = this.regenerateCards();
    return (
      <View className="AcceptView">
        <View className="AcceptCardsContainer">
          {AcceptCards}
        </View>
        <View className="AcceptControlsContainer">
          <Button onPress={this.finishApproval.bind(this)} title="Download Selections"></Button>
        </View>
      </View>
    )
  }
}

export default AcceptView;
