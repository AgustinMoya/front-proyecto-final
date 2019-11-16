import React from "react";

const { Provider, Consumer } = React.createContext({
  platform: null
});

export function withPlatformValue(Component) {
  return function ComponentWithValues(props) {
    return (
      <Consumer>
        {({ setPlatformValue, platformValue }) => (
          <Component
            {...props}
            setPlatformValue={setPlatformValue}
            platformValue={platformValue}
          />
        )}
      </Consumer>
    );
  };
}

export default class PlatformProvider extends React.Component {
  state = { platform: null };

  setPlatformValue(value) {
    this.setState({
      platform: value
    });
  }

  render() {
    return (
      <Provider
        value={{
          setPlatformValue: value => this.setPlatformValue(value),
          platformValue: this.state.platform
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}
