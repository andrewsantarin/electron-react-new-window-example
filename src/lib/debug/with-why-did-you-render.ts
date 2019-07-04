export const withWhyDidYouRender = function withWhyDidYouRender(isEnabled?: boolean) {
  return function applyPropToComponent(Component: any) {
    if (isEnabled) {
      Component.whyDidYouRender = true;
    }
  }
}
