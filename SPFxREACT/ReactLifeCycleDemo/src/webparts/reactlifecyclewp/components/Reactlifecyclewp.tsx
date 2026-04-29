import * as React from 'react';
import type { IReactlifecyclewpProps } from './IReactlifecyclewpProps';

/**
 * State interface
 * This defines what data our component will manage internally
 */
export interface IReactlifecyclewpState {
  stageTitle: string;
}

/**
 * Class Component
 * This component demonstrates React Lifecycle Methods in SPFx
 */
export default class Reactlifecyclewp extends React.Component<IReactlifecyclewpProps, IReactlifecyclewpState> {

  /**
   * Constructor
   * - First method that gets called when component is created
   * - Used to initialize state and bind methods
   */
  constructor(props: IReactlifecyclewpProps) {
    super(props);

    // Initial state setup
    this.state = {
      stageTitle: 'Constructor has been called'
    };

    // Binding method so "this" works correctly
    this.updateState = this.updateState.bind(this);

    console.log('Constructor executed');
  }

  /**
   * componentDidMount
   * - Called AFTER component is rendered on the screen (DOM)
   * - Best place for API calls / data fetching
   */
  public componentDidMount(): void {
    console.log('componentDidMount executed');

    // Example: updating state after component mounts
    this.setState({
      stageTitle: 'componentDidMount has been called'
    });
  }

  /**
   * updateState (Custom Method)
   * - This method is triggered when button is clicked
   * - It updates the component state
   */
  public updateState(): void {
    this.setState({
      stageTitle: 'State updated on button click'
    });

    console.log('State updated using button click');
  }

  /**
   * componentWillUnmount
   * - Called just BEFORE component is removed from DOM
   * - Used for cleanup (timers, event listeners, etc.)
   */
  public componentWillUnmount(): void {
    console.log('componentWillUnmount executed');
  }

  /**
   * render method
   * - Responsible for displaying UI
   * - Runs every time state or props change
   */
  public render(): React.ReactElement<IReactlifecyclewpProps> {
    return (
      <div>
        <h1>React Lifecycle Demo (SPFx)</h1>

        {/* Display current state */}
        <h3>{this.state.stageTitle}</h3>

        {/* Button to update state */}
        <button onClick={this.updateState}>
          Click Here To Update State
        </button>
      </div>
    );
  }
}