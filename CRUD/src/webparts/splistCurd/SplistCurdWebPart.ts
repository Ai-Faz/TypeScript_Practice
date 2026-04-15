import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './SplistCurdWebPart.module.scss';
import * as strings from 'SplistCurdWebPartStrings';

import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions
} from '@microsoft/sp-http';

export interface ISplistCurdWebPartProps {
  description: string;
}

export default class SplistCurdWebPart extends BaseClientSideWebPart<ISplistCurdWebPartProps> {

  private _isDarkTheme: boolean = false;

  public render(): void {

    this.domElement.innerHTML = `
    <div class="${styles.splistCrud}">
      <div class="${styles.container}">
        
        <span class="${styles.title}">Employee Form</span>

        <p class="${styles.subTitle}">
          Insert data into SharePoint List
        </p>

        <p class="${styles.description}">
          ${escape(this.properties.description)}
        </p>

        <table>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Department</th>
          </tr>

          <tr>
            <td><input type="text" id="txtboxFN" placeholder="Enter First Name"/></td>
            <td><input type="text" id="txtboxLN" placeholder="Enter Last Name"/></td>
            <td><input type="text" id="txtboxDepartment" placeholder="Enter Department"/></td>
          </tr>

          <tr>
            <td><input type="button" value="Insert" id="btnSubmit" /></td>
            <td><input type="button" value="Update" id="btnUpdate" /></td>
            <td><input type="button" value="Delete" id="btnDelete" /></td>
          </tr>
        </table>

      </div>
    </div>
    `;

    this.bindEvents();
  }

  // ✅ EVENT BINDING
  private bindEvents(): void {

    this.domElement.querySelector("#btnSubmit")
      ?.addEventListener("click", () => this.insertItem());

  }

  // ✅ INSERT METHOD
  private insertItem(): void {

  const FirstName = (document.getElementById("txtboxFN") as HTMLInputElement).value;
  const LastName = (document.getElementById("txtboxLN") as HTMLInputElement).value;
  const Department = (document.getElementById("txtboxDepartment") as HTMLInputElement).value;

  if (!FirstName || !LastName || !Department) {
    alert("⚠️ Please fill all fields");
    return;
  }

  const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Emp')/items`;

  const item = {
    Title: "Mr",
    FirstName: FirstName,
    LastName: LastName,
    Department: Department
  };

  const options: ISPHttpClientOptions = {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  };

  this.context.spHttpClient
    .post(url, SPHttpClient.configurations.v1, options)
    .then((res: SPHttpClientResponse) => {

      if (res.status === 201) {
        alert("✅ Item inserted successfully");
      } else {
        res.json().then(err => {
          console.error("FULL ERROR:", err);
          alert("❌ Error: " + JSON.stringify(err));
        });
      }

    })
    .catch(err => {
      console.error("CATCH:", err);
      alert("❌ API Failed");
    });
}

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) return;

    this._isDarkTheme = !!currentTheme.isInverted;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "SP List CRUD"
          },
          groups: [
            {
              groupName: "Basic Settings",
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