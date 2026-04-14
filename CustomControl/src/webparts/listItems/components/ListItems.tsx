import * as React from 'react';
import styles from './ListItems.module.scss';
import type { IListItemsProps } from './IListItemsProps';
import AsyncDropdown from '../../../controls/PropertyPaneAsyncDropdown/AsyncDropdown';
import { IDropdownOption } from '@fluentui/react';

export default class ListItems extends React.Component<IListItemsProps> {

  private loadOptions = (): Promise<IDropdownOption[]> => {
    // dummy data (later SharePoint API laga dena)
    return Promise.resolve([
      { key: '1', text: 'Option 1' },
      { key: '2', text: 'Option 2' },
      { key: '3', text: 'Option 3' }
    ]);
  };

  private onDropdownChange = (option?: IDropdownOption): void => {
    console.log("Selected:", option);
  };

  public render(): React.ReactElement<IListItemsProps> {
    return (
      <div className={styles.secondWebPart}>
        
        <AsyncDropdown
          label="Select Item"
          loadOptions={this.loadOptions}
          onChanged={this.onDropdownChange}
          selectedKey={undefined}
          disabled={false}
          stateKey="dropdown1"
        />

      </div>
    );
  }
}