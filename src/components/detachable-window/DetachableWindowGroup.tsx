import React, { Fragment, FunctionComponent } from 'react';
import NewWindow from 'react-new-window';

import { withWhyDidYouRender, isDevelopment } from 'lib';

import { WindowRefObjectLookup, WindowRefObjectKey } from './detachable-window.hooks';
import { safeInvoke } from 'lib';


export type DetachableWindowGroupProps = {
  windowRefLookup?: WindowRefObjectLookup;
  onWindowCloseClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onWindowUnload?: (key: WindowRefObjectKey) => () => void;
  onWindowGroupCleanup?: (keys: WindowRefObjectKey[]) => void;
  createWindowRef?: (key: WindowRefObjectKey) => (node: NewWindow | null) => NewWindow | null;
};

export const DetachableWindowGroup: FunctionComponent<DetachableWindowGroupProps> = ({
  children,
  windowRefLookup = {},
  onWindowCloseClick,
  onWindowUnload,
  onWindowGroupCleanup,
  createWindowRef,
}) => {
  const keys = Object.keys(windowRefLookup);

  safeInvoke(onWindowGroupCleanup, keys);

  const title = keys.length > 0
    ? 'Child UUIDs:'
    : 'Open a new window to see some UUIDs!';

  return (
    <div className="App-button-group App-detached-container">
      <h2>{title}</h2>
      {keys.map((key) => (
        <Fragment key={key}>
          <button
            className="App-button"
            onClick={onWindowCloseClick}
            value={key}
          >
            <code>{key}</code>
            <span className="App-button-icon App-close-icon">x</span>
          </button>
          <NewWindow
            onUnload={safeInvoke(onWindowUnload, key)}
            ref={safeInvoke(createWindowRef, key)}
            features={{
              width: 600,
              height: 480,
            }}
          >
            <header className="App-header">
              <h2>Child UUID: <code>{key}</code> </h2>
              <div>Sharing state with parent window.</div>
              {children}
              <button
                className="App-button"
                onClick={onWindowCloseClick}
                value={key}
                >
                Close child
              </button>
            </header>
          </NewWindow>
        </Fragment>
      ))}
    </div>
  );
}

withWhyDidYouRender(isDevelopment())(DetachableWindowGroup);
