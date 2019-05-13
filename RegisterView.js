import React, { Component } from 'react';
import { View, Button } from 'react-native';
import t from 'tcomb-form-native';
import jsSHA from 'jssha';

let Form = t.form.Form;

let User = t.struct({
  username: t.String,
  email: t.String,
  password: t.String,
  confirmPassword: t.String
});

let options = {
  fields: {
    email: {
      keyboardType: 'email-address'
    },
    password: {
      password: true,
      secureTextEntry: true
    },
    confirmPassword: {
      password: true,
      secureTextEntry: true
    }
  },
  order: ['username', 'email', 'password', 'confirmPassword']
}

class RegisterView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      finished: false,
      sessionId: ''
    }
  }

  registerUser() {
    let secret = new jsSHA("SHA-512", "TEXT");
    secret.update(this.props.email);
    secret.update(Date.now());
    this.setState({sessionId: secret.getHash("HEX").substr(0, 10), finished: true});
  }

  render() {
    return (
      <View>
        <Form
          ref="form"
          type={User}
        />
        <Button onPress={this.registerUser}>Sign Up</Button>
      </View>
    )
  }
}

export default RegisterView;
