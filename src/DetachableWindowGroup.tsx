import React, { Fragment, useCallback, useRef, useState, FunctionComponent } from 'react';
import NewWindow from 'react-new-window';
import useEventListener from '@use-it/event-listener'; // Cherry-picking the modules avoids unnecesary 'keyboardjs' and 'rebound' peer dependency requirements. https://github.com/streamich/react-use/blob/master/docs/Usage.md
import useUnmount from 'react-use/lib/useUnmount';
import { memorize } from 'memorize-decorator';
import isNull from 'lodash/isNull';
import omit from 'lodash/omit';

import { Lookup } from 'types';
import { getUniqueTitleId, getUniqueUrlId, withWhyDidYouRender, isDevelopment } from './lib';


type WindowConfig = {
  titleId: string;
  urlId: string;
};
type DetachedWindowLookup = Lookup<WindowConfig>;
type DetachedWindowRefObjectLookup = Lookup<NewWindow | null>;

export const App: FunctionComponent<{}> = function App({ children }) {
  // #region window state and ref
  const [ detachedWindowLookup, setDetachedWindowLookup ] = useState({} as DetachedWindowLookup);
  const detachedWindowRefLookup = useRef({} as DetachedWindowRefObjectLookup);
  const detachedWindowKeys = Object.keys(detachedWindowLookup);
  
  const detachWindow = useCallback(
    () => {
      const newConfig: WindowConfig = {
        titleId: getUniqueTitleId(),
        urlId: getUniqueUrlId(),
      };
      const newDetached = {
        ...detachedWindowLookup,
        [newConfig.urlId]: newConfig,
      };
      setDetachedWindowLookup(newDetached);
    },
    [
      detachedWindowLookup,
      setDetachedWindowLookup,
    ]
  );

  const removeWindow = useCallback(
    memorize((key: string) => () => {
      setDetachedWindowLookup((oldDetached) => omit(oldDetached, key));
    }),
    [
      detachedWindowLookup,
      setDetachedWindowLookup,
    ],
  );

  const releaseWindow = useCallback(
    function releaseWindow(key: keyof DetachedWindowRefObjectLookup) {
      const detachedWindowRef = detachedWindowRefLookup.current[key];
      
      if (isNull(detachedWindowRef)) {
        return;
      }
      
      // Call the detachedWindowRef's release() API method.
      // Don't modify the state directly because that will be done during `removeWindow`.
      // This should prevent the <App> component from rerendering twice unnecessarily.
      detachedWindowRef.release();
    },
    [
      detachedWindowRefLookup,
    ]
  );

  const releaseWindows = function releaseWindows(keys: (keyof DetachedWindowRefObjectLookup)[]) {
    keys.forEach(releaseWindow);
  }

  const closeWindow = function closeWindow(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const key = event.currentTarget.value;
    releaseWindow(key);
  };

  // Cleanup procedures.
  useEventListener('beforeunload' as keyof WindowEventMap, () => {
    releaseWindows(detachedWindowKeys);
  });
  useUnmount(() => {
    releaseWindows(detachedWindowKeys);
  });

  const detachedWindowButtonGroupTitle = detachedWindowKeys.length > 0
    ? 'Child UUIDs:'
    : 'Open a new window to see some UUIDs!';
  // #endregion

  return (
    <Fragment>
      <button
        className="App-button"
        onClick={detachWindow}
      >
        Open a new window
      </button>
      <hr />
      <div className="App-button-group App-detached-container">
        <h2>{detachedWindowButtonGroupTitle}</h2>
        {detachedWindowKeys.map((key) => (
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
              ref={(node) => (detachedWindowRefLookup.current[key] = node)}
              features={{
                width: 600,
                height: 480,
              }}
            >
              <header className="App-header">
                <h2>Child UUID: <code>{key}</code> </h2>
                <div>Sharing state with parent window.</div>
                {children}
                {/* <p>
                  <label>Value from parent:</label>
                  <strong>{value}</strong>
                </p> */}
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
    </Fragment>
  );
}

withWhyDidYouRender(isDevelopment())(App);
