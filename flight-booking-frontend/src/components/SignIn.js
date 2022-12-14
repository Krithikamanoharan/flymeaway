import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { Button, Alert, Card, ListGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { compose } from "redux";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

import * as actions from "../actions";
import CustomInput from "./CustomInput";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
  }

  redirect() {
    if (this.props.user.userType == "admin") {
      this.props.history.push("/flights");
    } else {
      if (this.props.flight.hasOwnProperty("_id")) {
        this.props.history.push("/book");
      } else this.props.history.push("/");
    }
  }

  async onSubmit(formData) {
    console.log(formData);
    const res = await this.props.validateSignIn(formData);
    console.log(res);
    if (res) {
      await this.props.signIn(formData);
    }
    if (!this.props.errorMessage) {
      this.redirect();
    }
  }

  handleSignUp = () => {
    this.props.history.push("/signup");
  };

  async responseFacebook(response) {
    console.log(response);
    console.log(this.props.flight);
    await this.props.oauthFacebook(response.accessToken);
    if (!this.props.errorMessage) {
      this.redirect();
    }
  }

  async responseGoogle(response) {
    console.log(response);
    await this.props.oauthGoogle(response.accessToken);
    if (!this.props.errorMessage) {
      this.redirect();
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="row" style={{ margin:"-105",width:'100%',display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',backgroundImage: "url(" + "https://www.pixelstalk.net/wp-content/uploads/2016/05/HQ-Airplane-Wallpaper.jpg" + ")",
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}>
        <div className="col" style={{padding:170,height:'90vh'}}>
          <Card style={{ width: '50rem' }}>
            <Card.Header>Sign in to your account</Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit(this.onSubmit)}>
                <fieldset>
                  <Field
                    name="email"
                    type="email"
                    id="email"
                    label="Email address"
                    placeholder="Enter email"
                    // pattern="/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/"
                    required
                    component={CustomInput}
                  ></Field>
                </fieldset>
                <fieldset>
                  <Field
                    name="password"
                    type="password"
                    id="password"
                    label="Password"
                    placeholder="Password"
                    required
                    component={CustomInput}
                  ></Field>
                </fieldset>
                {this.props.errorMessage ? (
                  <Alert variant="danger">{this.props.errorMessage} </Alert>
                ) : null}
                <Button variant="primary" type="submit">
                  Sign In
                </Button>
              </form>
            </Card.Body>
          </Card>
          <Card style={{ width: '50rem' }}>
            <Card.Body>
              <Card.Text>Don't have an account?</Card.Text>
              <Button variant="link" onClick={this.handleSignUp}>
                Create account
              </Button>
            </Card.Body>
          </Card>
        </div>
        
        
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage,
    flight: state.flight.flight,
    user: state.auth.user,
  };
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: "signin" })
)(SignIn);
