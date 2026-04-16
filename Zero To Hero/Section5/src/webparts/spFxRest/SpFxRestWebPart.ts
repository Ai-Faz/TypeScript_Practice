import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './SpFxRestWebPart.module.scss';
import * as strings from 'SpFxRestWebPartStrings';

import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

// ✅ Interfaces
export interface ISpFxRestWebPartProps {
  description: string;
  SiteTitle: string;
  UserName: string;
  UserEmail: string;
  SiteUrl: string;
  Rating: number;
}

export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  Title: string;
}

export default class SpFxRestWebPart extends BaseClientSideWebPart<ISpFxRestWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  // ✅ Fetch SharePoint Lists
  private _getData(): Promise<ISPLists> {
    return this.context.spHttpClient
      .get(
        `${this.context.pageContext.web.absoluteUrl}/_api/web/lists`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => res.json());
  }

  // ✅ Call API + render list
  private _renderLists(): void {
    this._getData().then((res) => {
      this._display(res.value);
    }).catch((error) => {
      console.error('Error fetching lists:', error);
    });
  }

  // ✅ Display list data
  private _display(items: ISPList[]): void {

    let html: string = `<ul>`;

    items.forEach((item: ISPList) => {
      html += `
        <li>
          <span>${item.Title}</span>
        </li>`;
    });

    html += `</ul>`;

    const element: HTMLElement | null = this.domElement.querySelector('#SPListData');

    if (element) {
      element.innerHTML = html;
    }
  }

  public render(): void {

    const rating = Number(this.properties.Rating);

    this.domElement.innerHTML = `
      <div class="${styles.secondWebPart}">
        <div class="${styles.container}">
          <div class="${styles.card}">
            
            <span class="${styles.title}">
              Welcome To SharePoint
            </span>
            
            <p class="${styles.subTitle}">
              Custom SharePoint Experience Using Web Parts
            </p>

            <p class="${styles.description}">
              ${escape(this.properties.description)}
            </p>

            <p class="${styles.description}">
              <strong>Site:</strong> ${escape(this.properties.SiteTitle)}
            </p>

            <p class="${styles.description}">
              <strong>User:</strong> ${escape(this.properties.UserName)}
            </p>

            <p class="${styles.description}">
              <strong>Email:</strong> ${escape(this.properties.UserEmail)}
            </p>

            <p class="${styles.description}">
              <strong>URL:</strong> ${escape(this.properties.SiteUrl)}
            </p>

            <p class="${styles.description}">
              <strong>Rating:</strong> ⭐ ${rating} / 5
            </p>

            <a href="https://aka.ms/spfx" class="${styles.button}">
              <span class="${styles.label}">Learn More</span>
            </a>

          </div>
        </div>

        <div id="SPListData" style="margin-top:20px;"></div>
      </div>
    `;

    // ✅ Call API render
    this._renderLists();
  }

  // ✅ Auto-fill data
  protected onInit(): Promise<void> {

    this.properties.SiteTitle = this.context.pageContext.web.title;
    this.properties.UserName = this.context.pageContext.user.displayName;
    this.properties.UserEmail = this.context.pageContext.user.email;
    this.properties.SiteUrl = this.context.pageContext.site.absoluteUrl;

    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) {
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';

          switch (context.app.host.name) {
            case 'Office':
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOffice
                : strings.AppOfficeEnvironment;
              break;

            case 'Outlook':
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOutlook
                : strings.AppOutlookEnvironment;
              break;

            case 'Teams':
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentTeams
                : strings.AppTeamsTabEnvironment;
              break;

            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(
      this.context.isServedFromLocalhost
        ? strings.AppLocalEnvironmentSharePoint
        : strings.AppSharePointEnvironment
    );
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) return;

    this._isDarkTheme = !!currentTheme.isInverted;

    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || '');
      this.domElement.style.setProperty('--link', semanticColors.link || '');
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || '');
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
                }),

                PropertyPaneTextField('SiteTitle', {
                  label: "Site Title"
                }),

                PropertyPaneTextField('UserName', {
                  label: "User Name"
                }),

                PropertyPaneTextField('UserEmail', {
                  label: "User Email"
                }),

                PropertyPaneTextField('SiteUrl', {
                  label: "Site URL"
                }),

                PropertyPaneSlider('Rating', {
                  label: "Rate this WebPart",
                  min: 1,
                  max: 5,
                  value: 3,
                  showValue: true
                })

              ]
            }
          ]
        }
      ]
    };
  }
}