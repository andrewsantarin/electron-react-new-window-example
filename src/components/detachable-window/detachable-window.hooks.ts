import { useCallback, useRef, useState, RefObject } from 'react';
import NewWindow from 'react-new-window';
import useEventListener from '@use-it/event-listener'; // Cherry-picking the modules avoids unnecesary 'keyboardjs' and 'rebound' peer dependency requirements. https://github.com/streamich/react-use/blob/master/docs/Usage.md
import useUnmount from 'react-use/lib/useUnmount';
import { memorize } from 'memorize-decorator';
import isNull from 'lodash/isNull';
import omit from 'lodash/omit';

import { Lookup } from 'types';
import { getUniqueTitleId, getUniqueUrlId } from 'lib';


export type WindowConfig = {
  titleId: string;
  urlId: string;
};
export type WindowLookup = Lookup<WindowConfig>;

/**
 * Creates a lookup object state of detached window configs and state helper functions.
 */
export const useDetachableWindowsState = (): {
  /**
   * A lookup object state of detached window configs.
   */
  state: WindowLookup;
  /**
   * Updates the lookup object state.
   */
  setWindowState: React.Dispatch<React.SetStateAction<Lookup<WindowConfig>>>;
  /**
   * Adds a new detached window config to the state.
   */
  addNewWindow: () => void;
  /**
   * Removes a detached window config from the state.
   * 
   * @param {(WindowRefObjectKey)} key A reference to the window in the lookup.
   * @returns {function} A callback function to deassign the detached window from the state.
   */
  removeWindowByKey: (key: WindowRefObjectKey) => () => void;
} => {
  const [ windowLookup, setWindowLookup ] = useState<WindowLookup>({});

  const addNewWindow = useCallback(
    function addNewWindow() {
      const newConfig: WindowConfig = {
        titleId: getUniqueTitleId(),
        urlId: getUniqueUrlId(),
      };
      const newDetached = {
        ...windowLookup,
        [newConfig.urlId]: newConfig,
      };
      setWindowLookup(newDetached);
    },
    [
      windowLookup,
      setWindowLookup,
    ]
  );

  const removeWindowByKey = useCallback(
    memorize(function removeWindowByKey(key: keyof WindowLookup) {
      return () => {
        setWindowLookup((oldDetached) => omit(oldDetached, key));
      }
    }),
    [
      windowLookup,
      setWindowLookup,
    ],
  );

  return {
    state: windowLookup,
    setWindowState: setWindowLookup,
    addNewWindow,
    removeWindowByKey,
  };
}


export type WindowInstance = RefObject<NewWindow>['current'];
export type WindowRefObjectLookup = Lookup<WindowInstance>;
export type WindowRefObjectKey = keyof WindowRefObjectLookup;

/**
 * Creates a lookup object ref of detached window nodes and ref helper functions.
 */
export const useDetachableWindowsRef = (): {
  /**
   * A lookup object of detached window refs.
   */
  ref: React.MutableRefObject<Lookup<WindowInstance>>;
  /**
   * Inserts a lookup object ref entry to the detached window using a randomly-generated key.
   *
   * @param {(WindowRefObjectKey)} key A reference to the window in the lookup.
   * @returns {function} A callback function to assign the detached window to the ref.
   */
  createWindowRefByKey: (key: WindowRefObjectKey) => (node: WindowInstance) => WindowInstance;
  /**
   * Release a window by its key reference in the lookup and anything that was bound to it.
   *
   * @param {(WindowRefObjectKey)} key A reference to the window in the lookup.
   */
  releaseWindowByKey: (key: WindowRefObjectKey) => void;
  /**
   * Release windows by their key reference in the lookup and anything that was bound to them.
   *
   * @param {(WindowRefObjectKey)[]} keys An array of references to the windows in the lookup.
   */
  releaseWindowsByKeys: (keys: (WindowRefObjectKey)[]) => void;
  /**
   * Release windows by their key reference in the lookup and anything that was bound to them.
   * 
   * **Note:**
   * 
   * This runs only during the React "unmount" component lifecycle and window "beforeunmount" event.
   * Use it a cleanup procedure.
   * 
   * @param {(WindowRefObjectKey)[]} keys An array of references to the windows in the lookup.
   */
  releaseWindowsByKeysOnCleanup: (keys: (WindowRefObjectKey)[]) => void;
} => {
  const windowLookup = useRef<WindowRefObjectLookup>({});

  const createWindowRefByKey = (key: WindowRefObjectKey) => (node: WindowInstance) => windowLookup.current[key] = node;

  const releaseWindowByKey = useCallback(
    function releaseWindowByKey(key: WindowRefObjectKey) {
      const window = windowLookup.current[key];

      if (isNull(window)) {
        return;
      }

      // Call the window's release() API method.
      // Don't modify the state directly because that will be done during `removeWindow`.
      // This should prevent the <App> component from rerendering twice unnecessarily.
      window.release();
    },
    [
      windowLookup,
    ]
  );

  const releaseWindowsByKeys = (keys: (WindowRefObjectKey)[]) => {
    keys.forEach(releaseWindowByKey);
  }

  const releaseWindowsByKeysOnCleanup = (keys: (WindowRefObjectKey)[]) => {
    useEventListener('beforeunload' as keyof WindowEventMap, () => {
      releaseWindowsByKeys(keys);
    });
    useUnmount(() => {
      releaseWindowsByKeys(keys);
    });
  }

  return {
    ref: windowLookup,
    createWindowRefByKey,
    releaseWindowByKey,
    releaseWindowsByKeys,
    releaseWindowsByKeysOnCleanup,
  };
}
