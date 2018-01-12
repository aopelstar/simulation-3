import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
      <body>
        <div className="login"> {/* 54C */}
         <a href={process.env.REACT_APP_LOGIN}><button className="button">Login/Register</button></a></div> {/* 54H */}
        </body>
      </div>
    );
  }
}

export default App;
