import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './SppnpjscruddemoWebPart.module.scss';
import * as strings from 'SppnpjscruddemoWebPartStrings';

import * as pnp from 'sp-pnp-js'

export interface ISppnpjscruddemoWebPartProps {
  description: string;
}

export default class SppnpjscruddemoWebPart extends BaseClientSideWebPart<ISppnpjscruddemoWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    this.domElement.innerHTML = `
   <div>
          <div>
          <table border='5' bgcolor='aqua'>
            <tr>
            <td>Please Enter Software ID </td>
            <td><input type='text' id='txtID' />
            <td><input type='submit' id='btnRead' value='Read Details' />
            </td>
            </tr>
            <tr>
            <td>Software Title</td>
            <td><input type='text' id='txtSoftwareTitle' />
            </tr>
      
            <tr>
            <td>Software Name</td>
            <td><input type='text' id='txtSoftwareName' />
            </tr>
      
            <tr>
            <td>Software Vendor</td>
            <td>
            <select id="ddlSoftwareVendor">
              <option value="Microsoft">Microsoft</option>
              <option value="Sun">Sun</option>
              <option value="Oracle">Oracle</option>
              <option value="Google">Google</option>
            </select>  
            </td>
           
            </tr>
      
            <tr>
            <td>Software Version</td>
            <td><input type='text' id='txtSoftwareVersion' />
            </tr>
      
            <tr>
            <td>Software Description</td>
            <td><textarea rows='5' cols='40' id='txtSoftwareDescription'> </textarea> </td>
            </tr>
      
            <tr>
            <td colspan='2' align='center'>
            <input type='submit'  value='Insert Item' id='btnSubmit' />
            <input type='submit'  value='Update' id='btnUpdate' />
            <input type='submit'  value='Delete' id='btnDelete' />
            <input type='submit'  value='Show All Records' id='btnReadAll' />
            </td>
          </table>
          </div>
          <div id="divStatus"/>
      
          <h2>Get All List Items</h2>
          <hr/>
          <div id="spListData" />


          </div>`;
          this._bindEvents();
          this.readAllItems();
  }


  private _bindEvents() : void {
    this.domElement.querySelector('btnSubmit').addEventListener('click' , ()=> {this.addListItem();});
  }
  private addListItem() : void {
    var softwaretitle = (document.getElementById("txtSoftwareTitle")as HTMLInputElement)!["value"];
    var softwarename = (document.getElementById("txtSoftwareName")as HTMLInputElement)!["value"];
    var softwareversion = (document.getElementById("txtSoftwareVersion")as HTMLInputElement)!["value"];
    var softwarevendor = (document.getElementById("ddlSoftwareVendor")as HTMLInputElement)!["value"];
    var softwareDescription = (document.getElementById("txtSoftwareDescription")as HTMLInputElement)!["value"];

    const siteurl: string = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('SoftwareCatalog')/items";

      pnp.sp.web.lists.getByTitle("SoftwareCatalog").items.add({
        
      Title: softwaretitle,
      SoftwareVendor: softwarevendor,
      SoftwareName: softwarename,
      SoftwareVersion: softwareversion,
      SoftwareDescription: softwareDescription,

      }).then(r => {
        alert("success");
      });
  }


  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

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
