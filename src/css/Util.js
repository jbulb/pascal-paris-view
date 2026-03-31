import { Component } from 'react';
import '../css/Login.css';

class Util extends Component {

  static isLocal() {
    return window.location.hostname.includes("localhost");
  }

  static contentDomain() {
    return this.isLocal() ? "http://localhost:8642" : "https://tolvatech.com";
  }

}

export default Util;
