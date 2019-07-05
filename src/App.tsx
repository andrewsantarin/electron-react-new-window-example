import React, { Fragment, useCallback, useRef, useState } from 'react';
import NewWindow from 'react-new-window';
import useEventListener from '@use-it/event-listener'; // Cherry-picking the modules avoids unnecesary 'keyboardjs' and 'rebound' peer dependency requirements. https://github.com/streamich/react-use/blob/master/docs/Usage.md
import useUnmount from 'react-use/lib/useUnmount';
import { memorize } from 'memorize-decorator';
import isNull from 'lodash/isNull';
import omit from 'lodash/omit';

import logo from './logo.svg';
import './App.css';

import { getUniqueTitleId, getUniqueUrlId, withWhyDidYouRender, isDevelopment } from 'lib';
import { useIncrementalValue } from 'components/incremental-value/incremental-value.hooks';
import { IncrementalValueGroup } from 'components/incremental-value/IncrementalValueGroup';
import { useDetachableWindowsState, useDetachableWindowsRef } from 'components/detachable-window/detachable-window.hooks';
import { AddDetachableWindowButton } from 'components/detachable-window/AddDetachableWindowButton';
import { DetachableWindowGroup } from 'components/detachable-window/DetachableWindowGroup';


type Lookup<Value> = {
  [key: string]: Value;
};
type WindowConfig = {
  titleId: string;
  urlId: string;
};
type DetachedWindowLookup = Lookup<WindowConfig>;
type DetachedWindowRefObjectLookup = Lookup<NewWindow | null>;

export const App = function App() {
  const {
    value,
    changeValue,
    incrementValue,
    decrementValue,
  } = useIncrementalValue();

  const {
    state,
    addNewWindow,
    removeWindowByKey,
  } = useDetachableWindowsState();

  const {
    ref,
    createRef,
    releaseWindowByKey,
    releaseWindowsByKeys,
    releaseWindowsByKeysOnCleanup,
  } = useDetachableWindowsRef();

  const closeWindow = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const key = event.currentTarget.value;
    releaseWindowByKey(key);
  };

  releaseWindowsByKeysOnCleanup(keys);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>{window.location.href}</h1>
        <IncrementalValueGroup
          value={value}
          onChange={changeValue}
          onIncrementClick={incrementValue}
          onDecrementClick={decrementValue}
        />
        <AddDetachableWindowButton
          onAddClick={addNewWindow}
          text="Open a new window"
        />
        <hr />
        <DetachableWindowGroup
          windowRefLookup={create}
          onWindowCloseClick={closeWindow}
          onWindowUnload={}
          onWindowGroupCleanup
          createWindowRef={createRef}
        >

        </DetachableWindowGroup>
      </header>
    </div>
  );
}

withWhyDidYouRender(isDevelopment())(App);
