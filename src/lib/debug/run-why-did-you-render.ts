export type NotifierParameters = {
  Component?: any;
  displayName?: string;
  prevProps?: any;
  prevState?: any;
  nextProps?: any;
  nextState?: any;
  reason?: any;
  options?: any;
};

export type NotifierFunction = (params: NotifierParameters) => void

export type Options = {
  include?: RegExp | null;
  exclude?: RegExp | null;
  trackHooks?: boolean;
  logOnDifferentValues?: boolean;
  hotReloadBufferMs?: number;
  onlyLogs?: boolean;
  collapseGroups?: boolean;
  titleColor?: string;
  diffNameColor?: string;
  diffPathColor?: string;
  notifier?: NotifierFunction;
}

/**
 * Applies a `why-did-you-render` console notification patch to React which logs unnecessary rerenders when they happen.
 * 
 * @export 
 * @param {boolean} [isEnabled] Indicates whether the patch should run (e.g. on development only?).
 * @param {boolean} [noClassesTranspile] Indicates whether the React app will use native `class` syntax, thus ignoring Babel class transpilers.
 * 
 * @returns {*} A patched version of React that writes "unnecessary rerender" reports to the console.
 */
export const runWhyDidYouRender = function runWhyDidYouRender(isEnabled?: boolean, noClassesTranspile?: boolean) {
  return function patchReact(React: any, options?: Options) {
    if (isEnabled) {
      const whyDidYouRender = noClassesTranspile 
        ? require('@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender.min.js')
        : require('@welldone-software/why-did-you-render');

      whyDidYouRender(React, options);
    }
  }
}
