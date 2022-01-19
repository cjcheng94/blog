//Code Splitting
//See https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html

import React, { Component } from "react";

//The asyncComponent function takes an argument;
//a function (importComponent) that when called will dynamically
//import a given component. This will make more sense below when we use asyncComponent

type ImportedComponent = () => Promise<any>;

type Props = unknown;

type State = {
  component: React.ComponentType | null;
};

export default function asyncComponent(importComponent: ImportedComponent) {
  class AsyncComponent extends Component<Props, State> {
    constructor(props: unknown) {
      super(props);
      this.state = {
        component: null
      };
    }

    // On componentDidMount, we simply call the importComponent function
    // that is passed in. And save the dynamically loaded component in the state.
    async componentDidMount() {
      const { default: component } = await importComponent();
      this.setState({ component });
    }

    render() {
      const C = this.state.component;

      // Finally, we conditionally render the component if it has completed loading.
      // If not we simply render null. But instead of rendering null, you could render a loading spinner.
      // This would give the user some feedback while a part of your app is still loading.
      return C ? <C {...this.props} /> : null;
    }
  }

  return AsyncComponent;
}
