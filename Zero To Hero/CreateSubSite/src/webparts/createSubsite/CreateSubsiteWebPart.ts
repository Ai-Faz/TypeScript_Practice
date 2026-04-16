import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './CreateSubsiteWebPart.module.scss';

import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions
} from '@microsoft/sp-http';

export interface ICreateSubsiteWebPartProps {
  description: string;
}

export default class CreateSubsiteWebPart extends BaseClientSideWebPart<ICreateSubsiteWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.createSubsite}">
        <div class="${styles.container}">
          <div class="${styles.row}">
            <div class="${styles.column}">

              <h3>Create New SharePoint Subsite</h3>

              <label>Subsite Name</label>
              <input type="text" id="NewSPSubsiteTitle" class="${styles.input}" />

              <label>Subsite URL</label>
              <input type="text" id="NewSPSubSiteUrl" class="${styles.input}" />

              <label>Description</label>
              <input type="text" id="NewSPSubsitedesc" class="${styles.input}" />

              <button id="CreateNewSPSubsite" class="${styles.button}">
                Create Subsite
              </button>

            </div>
          </div>
        </div>
      </div>
    `;

    this.createEvent();
  }

  private createEvent(): void {
    this.domElement
      .querySelector("#CreateNewSPSubsite")
      ?.addEventListener("click", () => {
        this.createSubsite();
      });
  }

  private createSubsite(): void {

    const subsiteTitle = (document.getElementById("NewSPSubsiteTitle") as HTMLInputElement).value.trim();
    const subsiteUrl = (document.getElementById("NewSPSubSiteUrl") as HTMLInputElement).value.trim();
    const subsiteDesc = (document.getElementById("NewSPSubsitedesc") as HTMLInputElement).value.trim();

    // ✅ Validation
    if (!subsiteTitle || !subsiteUrl) {
      alert("⚠️ Please fill all required fields");
      return;
    }

    // ✅ Clean + unique URL (fix duplicate error)
    const cleanUrl = subsiteUrl.replace(/\s+/g, "").toLowerCase();
    const uniqueUrl = cleanUrl + "-" + new Date().getTime();

    const url = this.context.pageContext.web.absoluteUrl + "/_api/web/webinfos/add";

const spHttpClientOptions: ISPHttpClientOptions = {
  body: JSON.stringify({
    parameters: {
      "@odata.type": "SP.WebInfoCreationInformation",
      Title: subsiteTitle,
      Url: uniqueUrl,
      Description: subsiteDesc,
      Language: 1033,
      WebTemplate: "STS"
    }
  })
};

    this.context.spHttpClient
      .post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
      .then(async (res: SPHttpClientResponse) => {

        const responseText = await res.text();
        console.log("API Response:", responseText);

        if (res.ok) {
          alert("✅ Subsite created successfully!");

          // clear fields
          (document.getElementById("NewSPSubsiteTitle") as HTMLInputElement).value = "";
          (document.getElementById("NewSPSubSiteUrl") as HTMLInputElement).value = "";
          (document.getElementById("NewSPSubsitedesc") as HTMLInputElement).value = "";

        } else {
          alert("❌ Error: " + responseText);
        }

      })
      .catch((error) => {
        console.error("Error:", error);
        alert("⚠️ Something went wrong");
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
            description: "Create Subsite"
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