import React, { Component } from 'react';
import Main from './main/app/page/Main';
import EntranceAnimation from './main/app/page/entrance/EntranceAnimation';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { enter: false };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ enter: true });
    }, 3500)
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        {this.state.enter ?
          <Main style={{ height: '100%' }} key="zero" />
          :
          <EntranceAnimation style={{ height: '100%' }} key="one" />
        }
      </div>
    );
  }
}
export default App;
