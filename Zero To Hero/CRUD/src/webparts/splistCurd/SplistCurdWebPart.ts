import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './SplistCurdWebPart.module.scss';

import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions
} from '@microsoft/sp-http';

// ✅ FIXED INTERFACE
export interface IEmp {
  Title: string;
  FirstName: string;
  LastName: string;
  Department: string;
  Empid: string;
}

export interface ISplistCurdWebPartProps {
  description: string;
}

export default class SplistCurdWebPart extends BaseClientSideWebPart<ISplistCurdWebPartProps> {

  public render(): void {

    this.domElement.innerHTML = `
    <div class="${styles.splistCrud}">
      <div class="${styles.container}">
        
        <span class="${styles.title}">Employee Form</span>

        <p class="${styles.subTitle}">
          Insert & Retrieve SharePoint Data
        </p>

        <p class="${styles.description}">
          ${escape(this.properties.description)}
        </p>

        <table>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Department</th>
            <th>EmpID</th>
          </tr>

          <tr>
            <td><input type="text" id="txtboxFN" /></td>
            <td><input type="text" id="txtboxLN" /></td>
            <td><input type="text" id="txtboxDepartment" /></td>
            <td><input type="text" id="txtboxEmpID" /></td>
          </tr>

          <tr>
            <td><input type="button" value="Insert" id="btnSubmit" /></td>
            <td><input type="button" value="Update" id="btnUpdate" /></td>
            <td><input type="button" value="Delete" id="btnDelete" /></td>
          </tr>

          <tr>
            <td>Retrieve item</td>
            <td>SP ID <input type="text" id="EmpId"/></td>
            <td><input type="button" value="Retrieve" id="btnGetEmp"/></td>
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

    this.domElement.querySelector("#btnGetEmp")
      ?.addEventListener("click", () => this.GetEmpbyId());
  }

  // ✅ GET ITEM (FIXED)
private GetItem(id: string): Promise<IEmp> {

  const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Emp')/items?$filter=Empid eq '${id}'`;

  return this.context.spHttpClient
    .get(url, SPHttpClient.configurations.v1)
    .then((res: SPHttpClientResponse) => res.json())
    .then((data: any) => {

      if (!data.value || data.value.length === 0) {
        throw new Error("Item not found");
      }

      return data.value[0] as IEmp;
    });
}

  // ✅ GET BY ID (FIXED)
  private GetEmpbyId(): void {

    const id = (document.getElementById("EmpId") as HTMLInputElement).value;

    if (!id) {
      alert("⚠️ Enter SharePoint ID");
      return;
    }

    this.GetItem(id)
      .then(emp => {

        (document.getElementById("txtboxFN") as HTMLInputElement).value = emp.FirstName;
        (document.getElementById("txtboxLN") as HTMLInputElement).value = emp.LastName;
        (document.getElementById("txtboxDepartment") as HTMLInputElement).value = emp.Department;
        (document.getElementById("txtboxEmpID") as HTMLInputElement).value = emp.Empid;

      })
      .catch(err => {
        console.error(err);
        alert("❌ " + err.message);
      });
  }

  // ✅ INSERT METHOD (FINAL)
  private insertItem(): void {

    const FirstName = (document.getElementById("txtboxFN") as HTMLInputElement).value;
    const LastName = (document.getElementById("txtboxLN") as HTMLInputElement).value;
    const Department = (document.getElementById("txtboxDepartment") as HTMLInputElement).value;
    const Empid = (document.getElementById("txtboxEmpID") as HTMLInputElement).value;

    if (!FirstName || !LastName || !Department || !Empid) {
      alert("⚠️ Please fill all fields");
      return;
    }

    const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Emp')/items`;

    const item = {
      Title: "Mr",
      FirstName,
      LastName,
      Department,
      Empid
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

          // clear
          (document.getElementById("txtboxFN") as HTMLInputElement).value = "";
          (document.getElementById("txtboxLN") as HTMLInputElement).value = "";
          (document.getElementById("txtboxDepartment") as HTMLInputElement).value = "";
          (document.getElementById("txtboxEmpID") as HTMLInputElement).value = "";

        } else {
          res.json().then(err => {
            console.error(err);
            alert("❌ " + err.error.message);
          });
        }

      })
      .catch(err => {
        console.error(err);
        alert("❌ API Failed");
      });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: "SP List CRUD" },
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