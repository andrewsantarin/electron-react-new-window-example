# electron-react-new-window-example
Mutliple window instances using:
- [`electron@5.0.6`](https://github.com/electron/electron)
- [`react@16.8.6`](https://github.com/facebook/react) (state management here)
- [`react-dom@16.8.6`](https://github.com/facebook/react/tree/master/packages/react-dom) (the `ReactDOM.createPortal()` function allows awesome out-of-DOM hierarchy abilities)
- [`react-new-window@0.1.1`](https://github.com/rmariuzzo/react-new-window)
- `react-scripts@3.0.1` (via the [`create-react-app`](https://github.com/facebook/create-react-app) Web project bootstrapper)
- [`typescript@3.5.2`](https://github.com/microsoft/typescript) ([TypeScript](https://www.typescriptlang.org/) is application-scale typing safety for JavaScript)

This example makes use of React's abilities to create HTML content outside of the main window hierarchy through [Portals](https://reactjs.org/docs/portals.html) ([additional reading](https://codeburst.io/reacts-portals-in-3-minutes-9b2efb74e9a9)) and to control how those components behave, using state. This example also uses [Hooks](https://reactjs.org/docs/hooks-intro.html), so no classes here.

The [Create React App readme](./CREATE-REACT-APP-README.md) is available in a separate file.

**Table of Contents**
- [Installation](#Installation)
- [Running](#Running)
  - [All at once](#All-at-once)
  - [Separately](#Separately)
    - [Electron](#Electron)
    - [React](#React)

## Installation
1. Clone the project.
2. Install the dependencies. (**Note:** This project uses [Yarn](https://yarnpkg.com). You may use [NPM](https://npmjs.com), but I don't guarantee any package integrities that way...)

**Quick Start Commands:**

```sh
git clone https://github.com/andrewsantarin/electron-react-new-window-example.git && cd electron-react-new-window-example
yarn
```

## Running

### All at once
The app contains two parts:
- the Electron Node.js app
- the React Web app

Start the app with both of those parts running in parallel under one terminal:
```sh
yarn start
```

### Separately
If you need to run them separately for, e.g. monitoring those apps separately (`create-react-app` kind of swallows the terminal logs coming from Node.js with [`concurrently`](https://github.com/kimmobrunfeldt/concurrently) running),
you can use these commands, which are just convenience aliases. (**Note:** In order to actually see the app running, the React instance must run at [http://localhost:3000](http://localhost:3000)).

#### Electron
```sh
yarn electron-start # electron .
```

#### React
```sh
yarn react-start # react-scripts start
```
