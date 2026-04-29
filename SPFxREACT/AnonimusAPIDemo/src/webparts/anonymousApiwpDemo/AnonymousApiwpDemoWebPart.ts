import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AnonymousApiwpDemoWebPartStrings';
import AnonymousApiwpDemo from './components/AnonymousApiwpDemo';
import { IAnonymousApiwpDemoProps } from './components/IAnonymousApiwpDemoProps';

import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';

/**
 * Properties interface (Property Pane values)
 */
export interface IAnonymousApiwpDemoWebPartProps {
  description: string;
}

/**
 * Main WebPart Class
 */
export default class AnonymousApiwpDemoWebPart 
  extends BaseClientSideWebPart<IAnonymousApiwpDemoWebPartProps> {

  /**
   * render()
   * - Entry point of WebPart UI rendering
   * - Here we call API first, then pass data to React component
   */
  public render(): void {

    // Call API method
    this.getUserDetails()
      .then(response => {

        // Create React element and pass API data as props
        const element: React.ReactElement<IAnonymousApiwpDemoProps> = React.createElement(
          AnonymousApiwpDemo,
          {
            description: this.properties.description,

            // Data coming from API response
            id: response.id,
            name: response.name,
            username: response.username,
            email: response.email,

            // Formatting address string
            address:
              'Street: ' + response.address.street +
              ' | Suite: ' + response.address.suite +
              ' | City: ' + response.address.city +
              ' | Zip: ' + response.address.zipcode,

            phone: response.phone,
            website: response.website,
            company: response.company.name
          }
        );

        // Render React component inside WebPart DOM
        ReactDom.render(element, this.domElement);
      })
      .catch(error => {
        console.error("Error fetching API:", error);
      });
  }

  /**
   * getUserDetails()
   * - Calls external API using SPFx HttpClient
   * - Returns Promise with JSON data
   */
  private getUserDetails(): Promise<any> {

    return this.context.httpClient.get(
      'https://jsonplaceholder.typicode.com/users/2', // Public API
      HttpClient.configurations.v1
    )
      .then((response: HttpClientResponse) => {

        // Convert response to JSON
        return response.json();
      })
      .then(jsonResponse => {

        // Return actual data
        return jsonResponse;
      });
  }

  /**
   * onDispose()
   * - Called when WebPart is removed from page
   * - Used to clean up React component
   */
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  /**
   * dataVersion
   * - Defines version of WebPart data schema
   */
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  /**
   * Property Pane Configuration
   * - Defines editable fields in WebPart settings
   */
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [

                // Text field in property pane
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })

              ]
            }
          ]
        }
      ]
    };
  }
}