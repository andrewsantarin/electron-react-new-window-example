import React, { Fragment, useCallback, useState } from 'react';
import NewWindow from 'react-new-window';

import logo from './logo.svg';
import './App.css';

import { getUniqueTitleId, getUniqueUrlId, withWhyDidYouRender, isDevelopment } from './lib';


type WindowConfig = {
  titleId: string;
  urlId: string;
};
type WindowDetached = {
  [key: string]: WindowConfig;
};

export const App = function App() {
  const [ value, setValue ] = useState(0);
  const [ detached, setDetached ] = useState({} as WindowDetached);

  const detachWindow = useCallback(
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
  const removeWindow = useCallback(
    (key: string) => () => {
      console.log('removeWindow', key);
      const {
        [key]: removedConfig,
        ...newDetached
      } = detached;
      setDetached(newDetached);
    },
    [
      detached,
      setDetached,
    ],
  )
  const closeWindow = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      console.log('closeWindow', event.currentTarget.value);
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

  const changeValue = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(parseInt(event.currentTarget.value));
    },
    [
      setValue,
    ]
  );
  const incrementValue = useCallback(
    () => {
      setValue(value + 1);
    },
    [
      value,
      setValue,
    ]
  );
  const decrementValue = useCallback(
    () => {
      setValue(value - 1);
    },
    [
      value,
      setValue,
    ]
  );

  const detachedKeys = Object.keys(detached);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>{window.location.href}</h1>
        <p className="App-input-group ">
          <label>
            <span className="label">Provide a value:</span>
            <input
              type="number"
              value={value}
              onChange={changeValue}
            />
            <button onClick={incrementValue}>+</button>
            <button onClick={decrementValue}>-</button>
          </label>
        </p>
        <button
          className="App-button"
          onClick={detachWindow}
        >
          Open a new window
        </button>
        <hr />
        <div className="App-button-group App-detached-container">
          {detachedKeys.length > 0 
            ? <h2>Child UUIDs:</h2>
            : <h2>Open a new window to see some UUIDs</h2>
          }
          {detachedKeys.map((key) => (
            <Fragment key={key}>
              <button
                className="App-button"
                onClick={closeWindow}
                value={key}
              >
                <code>{key}</code>
                <span className="App-button-icon App-close-icon">x</span>
              </button>
              <NewWindow
                onUnload={removeWindow(key)}
                features={{
                  width: 600,
                  height: 480,
                }}
              >
                <header className="App-header">
                  <h2>Child UUID: <code>{key}</code> </h2>
                  <div>Sharing state with parent window.</div>
                  <p>
                    <label>Value from parent:</label>
                    <strong>{value}</strong>
                  </p>
                  <button
                    className="App-button"
                    onClick={closeWindow}
                    value={key}
                    >
                    Close child
                  </button>
                </header>
              </NewWindow>
            </Fragment>
          ))}
        </div>
      </header>
    </div>
  );
}

withWhyDidYouRender(isDevelopment())(App);
