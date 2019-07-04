// Ripped off of 'react-new-window' because I needed a WORKING example!
// https://github.com/rmariuzzo/react-new-window/blob/master/stories/default.stories.js
import React from 'react';
import NewWindow from 'react-new-window';


interface DefaultStoryProps {

}

interface DefaultStoryState {
  opened: boolean;
  count: number;
}

export class DefaultStory extends React.PureComponent<DefaultStoryProps, DefaultStoryState> {
  interval!: NodeJS.Timeout;

  state = {
    opened: false,
    count: 0
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(prevState => ({ count: prevState.count + 1 }))
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    const { opened, count } = this.state
    return (
      <div>
        <h2>React New Window</h2>
        <h3>Example</h3>
        <h4>Counting {count}...</h4>
        <button onClick={this.toggleOpened}>
          {opened ? 'Close the opened window' : 'Open a new window'}
        </button>
        {opened && (
          <NewWindow
            onUnload={this.newWindowUnloaded}
            features={{ left: 200, top: 200, width: 400, height: 400 }}
          >
            <h2>Hi 👋</h2>
            <h4>Counting here as well {count}...</h4>
            <button>Keeping the same style as my parent</button>
          </NewWindow>
        )}
      </div>
    )
  }

  toggleOpened = () => {
    this.setState(prevState => ({ opened: !prevState.opened }))
  }

  newWindowUnloaded = () => {
    this.setState({ opened: false });
  }
}
