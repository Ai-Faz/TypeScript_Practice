import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './CreateListWebPart.module.scss';
import * as strings from 'CreateListWebPartStrings';

import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions
} from '@microsoft/sp-http';

export interface ICreateListWebPartProps {
  description: string;
}

export default class CreateListWebPart extends BaseClientSideWebPart<ICreateListWebPartProps> {

  private _isDarkTheme: boolean = false;

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.secondWebPart}">
        <div class="${styles.container}">
          
          <div class="${styles.card}">
            <span class="${styles.title}">Welcome To SharePoint</span>
            
            <p class="${styles.subTitle}">
              Custom SharePoint Experience Using Web Parts
            </p>

            <p class="${styles.description}">
              ${escape(this.properties.description)}
            </p>

            <a href="https://aka.ms/spfx" class="${styles.button}">
              <span class="${styles.label}">Learn More</span>
            </a>
          </div>

          <div class="${styles.column}">
            <h3>Create New SharePoint List</h3>

            <label>Enter List Name:</label>
            <input type="text" id="NewSPList" placeholder="Enter list name..." />

            <input type="button" id="CreateNewSPList" value="Create List" />
          </div>

        </div>
      </div>
    `;

    this.attachEvents();
  }

  private attachEvents(): void {
    const button = this.domElement.querySelector('#CreateNewSPList');

    if (button) {
      button.addEventListener('click', () => this.createSPList());
    }
  }

private createSPList(): void {

  const input = this.domElement.querySelector('#NewSPList') as HTMLInputElement;
  const button = this.domElement.querySelector('#CreateNewSPList') as HTMLInputElement;

  if (!input || !input.value.trim()) {
    alert("⚠️ Please enter list name");
    return;
  }

  const listName = input.value.trim();

  button.disabled = true;
  button.value = "Creating...";

  const url = this.context.pageContext.web.absoluteUrl + "/_api/web/lists";

  // ✅ MINIMAL PAYLOAD (NO METADATA, NO HEADERS)
  const listDef = {
    Title: listName,
    BaseTemplate: 100
  };

  const options: ISPHttpClientOptions = {
    body: JSON.stringify(listDef)
  };

  this.context.spHttpClient.post(
    url,
    SPHttpClient.configurations.v1,
    options
  )
  .then(async (res: SPHttpClientResponse) => {

    if (res.ok) {
      alert("✅ SharePoint List Created Successfully");
      input.value = "";
    } else {
      const text = await res.text();
      console.error("Error:", text);
      alert("❌ Error: " + text);
    }

  })
  .catch((error) => {
    console.error("Catch:", error);
    alert("❌ Something went wrong");
  })
  .finally(() => {
    button.disabled = false;
    button.value = "Create List";
  });
}
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Settings"
          },
          groups: [
            {
              groupName: "Basic",
              groupFields: [
                PropertyPaneTextField('description', {
                  label: "Description"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}