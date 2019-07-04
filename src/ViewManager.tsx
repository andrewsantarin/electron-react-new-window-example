// More stuff that I don't need, but is here nonetheless...
// https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/623#issuecomment-333750155
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, RouteComponentProps } from 'react-router-dom';
import Update from './views/Update';
import Console from './views/Console';
import Home from './views/Home';

const Views = {
  update: <Update />,
  console: <Console />,
  home: <Home />,
};

export class ViewManager extends Component<any, any> {
  static View(props: RouteComponentProps<any>) {
    let name = props.location.search.substr(1);
    let view = Views[name as keyof typeof Views];

    if (view == null) {
      view = Views.home;
      // throw new Error("View '" + name + "' is undefined");
    }

    return view;
  }

  render() {
    return (
      <Router>
        <div>
          <Route path='/' component={ViewManager.View} />
        </div>
      </Router>
    );
  }
}
