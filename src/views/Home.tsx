import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import logo from '../logo.svg';
import '../App.css';

function getUniqueUrlId() {
  return (Math.random() * 1000000000000000)
    .toString(36)
    .replace('.', '');
}

function getUniqueTitleId() {
  return Math.floor(Math.random() * 1000000).toString(36);
}

interface MyWindowPortalProps {
  titleId: string;
  urlId: string;
}

interface MyWindowPortalState {
}

class MyWindowPortal extends React.PureComponent<MyWindowPortalProps, MyWindowPortalState> {
  containerEl: Element = document.createElement('div');
  externalWindow: Window | null = null;

  render() {
    // STEP 2: append props.children to the container <div> that isn't mounted anywhere yet
    return ReactDOM.createPortal(this.props.children, this.containerEl);
  }

  componentDidMount() {
    // STEP 3: open a new browser window and store a reference to it
    this.externalWindow = window.open(
      `${window.location.href}?window-uuid=${this.props.titleId}`,
      this.props.urlId,
      'width=600,height=400,left=200,top=200'
    );

    // STEP 4: append the container <div> (that has props.children appended to it) to the body of the new window
    this.externalWindow && this.externalWindow.document.body.appendChild(this.containerEl);
    // let modal = window.open('', 'modal')
    // this.externalWindow && this.externalWindow.document.write('<h1>Hello</h1>');
  }

  componentWillUnmount() {
    // STEP 5: This will fire when this.state.showWindowPortal in the parent component becomes false
    // So we tidy up by closing the window
    this.externalWindow && this.externalWindow.close();
  }
}

type WindowConfig = MyWindowPortalProps;
type WindowDetached = {
  [key: string]: WindowConfig;
};

const Home: React.FC = () => {
  const [ detached, setDetached ] = useState({} as WindowDetached);

  const detach = useCallback(
    () => {
      const newConfig: WindowConfig = {
        titleId: getUniqueTitleId(),
        urlId: getUniqueUrlId(),
      };
      const newDetached = {
        ...detached,
        [newConfig.urlId]: newConfig,
      };
      setDetached(newDetached);
    },
    [
      detached,
      setDetached,
    ]
  );

  const remove = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const {
        [event.currentTarget.value]: removedConfig,
        ...newDetached
      } = detached;
      setDetached(newDetached);
    },
    [
      detached,
      setDetached,
    ]
  );

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={detach}>
          Open a new window
        </button>
        {Object.keys(detached).map((key) => (
          <MyWindowPortal
            key={key}
            titleId={detached[key].titleId}
            urlId={detached[key].urlId}
          >
            <h1>New window: {key}</h1>
            <p>Even though I render in a different window, I share state!</p>
            <button
              onClick={remove}
              value={key}
            >
              Close me!
            </button>
          </MyWindowPortal>
        ))}
      </header>
    </div>
  );
}

export default Home;
