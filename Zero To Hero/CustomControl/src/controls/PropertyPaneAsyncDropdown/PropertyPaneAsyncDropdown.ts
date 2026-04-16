import * as React from 'react';
import * as ReactDom from 'react-dom';

import { IPropertyPaneField, PropertyPaneFieldType } from '@microsoft/sp-property-pane';

import { IDropdownOption } from '@fluentui/react';
import { IAsyncDropdownProps } from './Components/IAsyncDropdownProps';
import AsyncDropdown from './AsyncDropdown';
import { IPropertyPaneAsyncDropdownProps } from './IPropertyPaneAsyncDropdownProps';

import { IPropertyPaneAsyncDropdownInternalProps } from './IPropertyPaneAsyncDropdownInternalProps';

class PropertyPaneAsyncDropdownBuilder implements IPropertyPaneField<IPropertyPaneAsyncDropdownProps> {

  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IPropertyPaneAsyncDropdownInternalProps;

  private elem?: HTMLElement;

  constructor(targetProperty: string, properties: IPropertyPaneAsyncDropdownProps) {
    this.targetProperty = targetProperty;

    this.properties = {
      key: targetProperty,
      label: properties.label,
      loadOptions: properties.loadOptions,
      onPropertyChange: properties.onPropertyChange,
      selectedKey: properties.selectedKey,
      disabled: properties.disabled,
      stateKey: properties.stateKey,
      onRender: this.onRender.bind(this),
      onDispose: this.onDispose.bind(this)
    };
  }

  private onRender(elem: HTMLElement): void {
    if (!this.elem) {
      this.elem = elem;
    }

    // ✅ Using IAsyncDropdownProps explicitly
    const dropdownProps: IAsyncDropdownProps = {
      label: this.properties.label,
      loadOptions: this.properties.loadOptions,
      selectedKey: this.properties.selectedKey,
      disabled: this.properties.disabled,
      stateKey: this.properties.stateKey,
      onChanged: (option?: IDropdownOption) => {
        this.properties.onPropertyChange(this.targetProperty, option?.key);
      }
    };

    const element = React.createElement(AsyncDropdown, dropdownProps);

    ReactDom.render(element, elem);
  }

  private onDispose(element: HTMLElement): void {
    ReactDom.unmountComponentAtNode(element);
  }
}

export function PropertyPaneAsyncDropdown(
  targetProperty: string,
  properties: IPropertyPaneAsyncDropdownProps
): IPropertyPaneField<IPropertyPaneAsyncDropdownProps> {
  return new PropertyPaneAsyncDropdownBuilder(targetProperty, properties);
}