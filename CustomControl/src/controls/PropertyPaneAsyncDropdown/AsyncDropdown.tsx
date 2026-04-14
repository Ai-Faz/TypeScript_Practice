import * as React from 'react';
import { Dropdown, IDropdownOption, Spinner } from '@fluentui/react';

import { IAsyncDropdownProps } from './Components/IAsyncDropdownProps';
import { IAsyncDropdownState } from './Components/IAsyncDropdownState';

export default class AsyncDropdown extends React.Component<IAsyncDropdownProps, IAsyncDropdownState> {

  private selectedKey: string | number | undefined;

  constructor(props: IAsyncDropdownProps) {
    super(props);

    this.selectedKey = props.selectedKey;

    this.state = {
      loading: false,
      options: [],   // ✅ always array
      error: undefined
    };
  }

  public componentDidMount(): void {
    this.loadOptions();
  }

  public componentDidUpdate(prevProps: IAsyncDropdownProps): void {
    if (
      this.props.disabled !== prevProps.disabled ||
      this.props.stateKey !== prevProps.stateKey
    ) {
      this.loadOptions();
    }
  }

  private loadOptions(): void {
    this.setState({
      loading: true,
      error: undefined,
      options: []
    });

    this.props.loadOptions()
      .then((options: IDropdownOption[]) => {
        this.setState({
          loading: false,
          options: options,
          error: undefined
        });
      })
      .catch((error: any) => {
        this.setState({
          loading: false,
          options: [],
          error: error?.message || "Error loading options"
        });
      });
  }

  private onChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {
    this.selectedKey = option?.key;

    if (this.props.onChanged) {
      this.props.onChanged(option, index);
    }
  };

  public render(): React.ReactElement<IAsyncDropdownProps> {

    if (this.state.loading) {
      return <Spinner label="Loading options..." />;
    }

    if (this.state.error) {
      return <div>{this.state.error}</div>;
    }

    return (
      <Dropdown
        label={this.props.label}
        placeholder="Select an option"
        options={this.state.options}
        selectedKey={this.selectedKey}
        onChange={this.onChange}
        disabled={this.props.disabled}
      />
    );
  }
}