import React, { Component } from 'react';
import { View, Button } from 'react-native';
import t from 'tcomb-form-native';
import jsSHA from 'jssha';

let Form = t.form.Form;

let User = t.struct({
  email: t.String,
  password: t.String
})

let options = {
  fields: {
    email: {
      keyboardType: 'email-address'
    },
    password: {
      password: true,
      secureTextEntry: true
    }
  }
}

class LoginView extends Component {
  constructor(props) {
    super(props)
  }

  login() {

  }

  render() {
    return (
      <View>
        <Form
          ref="form"
          type={User}
        />
        <Button onPress={this.login}>Log In</Button>
      </View>
    )
  }
}

export default LoginView;
