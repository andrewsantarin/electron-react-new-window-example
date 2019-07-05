import { useCallback, useRef, useState } from 'react';
import NewWindow from 'react-new-window';
import useEventListener from '@use-it/event-listener'; // Cherry-picking the modules avoids unnecesary 'keyboardjs' and 'rebound' peer dependency requirements. https://github.com/streamich/react-use/blob/master/docs/Usage.md
import useUnmount from 'react-use/lib/useUnmount';
import { memorize } from 'memorize-decorator';
import isNull from 'lodash/isNull';
import omit from 'lodash/omit';

import { Lookup } from 'types';
import { getUniqueTitleId, getUniqueUrlId } from './lib';

type WindowConfig = {
  titleId: string;
  urlId: string;
};
type WindowLookup = Lookup<WindowConfig>;
type WindowRefObjectLookup = Lookup<NewWindow | null>;
type WindowRefObjectKey = keyof WindowRefObjectLookup;

export const useDetachableWindows = function useDetachableWindows() {
  const [ windowLookup, setWindowLookup ] = useState<WindowLookup>({});
  const windowRefLookup = useRef<WindowRefObjectLookup>({});
  const windowKeys: WindowRefObjectKey[] = Object.keys(windowLookup);

  const refWindow = (key: WindowRefObjectKey) => (node: NewWindow | null) => windowRefLookup.current[key] = node;

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
    memorize((key: string) => () => {
      setWindowLookup((oldDetached) => omit(oldDetached, key));
    }),
    [
      windowLookup,
      setWindowLookup,
    ],
  );

  const releaseWindowByKey = useCallback(
    function releaseWindowByKey(key: WindowRefObjectKey) {
      const windowRef = windowRefLookup.current[key];
      
      if (isNull(windowRef)) {
        return;
      }
      
      // Call the windowRef's release() API method.
      // Don't modify the state directly because that will be done during `removeWindow`.
      // This should prevent the <App> component from rerendering twice unnecessarily.
      windowRef.release();
    },
    [
      windowRefLookup,
    ]
  );

  const releaseWindowsByKeys = function releaseWindowsByKeys(keys: (WindowRefObjectKey)[]) {
    keys.forEach(releaseWindowByKey);
  }

  // Cleanup procedures.
  const releaseWindowsByKeysOnCleanup = function releaseWindowsByKeysOnCleanup(keys: (WindowRefObjectKey)[]) {
    useEventListener('beforeunload' as keyof WindowEventMap, () => {
      releaseWindowsByKeys(keys);
    });
    useUnmount(() => {
      releaseWindowsByKeys(keys);
    });
  }

  const api = {
    windowKeys,
    refWindow,
    addNewWindow,
    removeWindowByKey,
    releaseWindowByKey,
    releaseWindowsByKeys,
    releaseWindowsByKeysOnCleanup,
  };

  return api;
}
