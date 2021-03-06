/* @flow */

import { Children, Component, PropTypes } from 'react';

class CodeSplitProvider extends Component {
  // Prop types.
  static propTypes = {
    children: PropTypes.element.isRequired,
    context: PropTypes.object, // eslint-disable-line
    state: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        module: PropTypes.func.isRequired,
      }),
    ),
  };

  // Context types
  static childContextTypes = {
    registerChunkLoaded: PropTypes.func.isRequired,
    registerModule: PropTypes.func.isRequired,
    retrieveModule: PropTypes.func.isRequired,
  };

  // Members.
  chunks : { [key: string]: true } = {};
  modules : { [key: string]: Function } = {};

  getChildContext() {
    return {
      registerChunkLoaded: this.registerChunkLoaded,
      registerModule: this.registerModule,
      retrieveModule: this.retrieveModule,
    };
  }

  componentWillMount() {
    const { state } = this.props;
    if (state) {
      state.forEach(({ id, module }) => this.registerModule(id, module));
    }
  }

  registerChunkLoaded = (chunkName: string) => {
    this.chunks[chunkName] = true;
    if (this.props.context) {
      this.props.context.registerChunk(chunkName);
    }
  }

  registerModule = (moduleHash: string, module: Function) => {
    this.modules[moduleHash] = module;
    if (this.props.context) {
      this.props.context.registerModule(moduleHash);
    }
  }

  retrieveModule = (moduleHash: string) => this.modules[moduleHash];

  render() {
    return Children.only(this.props.children);
  }
}

export default CodeSplitProvider;
