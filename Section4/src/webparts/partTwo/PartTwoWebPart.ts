import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './PartTwoWebPart.module.scss';
import * as strings from 'PartTwoWebPartStrings';

export interface IPartTwoWebPartProps {
  description: string;
  CourseName: string;
  CourseCode: number;
  CourseDesc: string;
  Rating: number;
}

export default class PartTwoWebPart extends BaseClientSideWebPart<IPartTwoWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {

    const courseCode = Number(this.properties.CourseCode);
    const rating = Number(this.properties.Rating);

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

            <p class="${styles.description}">
              <strong>Course:</strong> ${escape(this.properties.CourseName)}
            </p>

            <p class="${styles.description}">
              <strong>Code:</strong> ${escape(courseCode.toString())}
            </p>

            <p class="${styles.description}">
              <strong>Description:</strong> ${escape(this.properties.CourseDesc)}
            </p>

            <p class="${styles.description}">
              <strong>Rating:</strong> ⭐ ${rating} / 5
            </p>

            <a href="https://aka.ms/spfx" class="${styles.button}">
              <span class="${styles.label}">Learn More</span>
            </a>

          </div>
        </div>
      </div>`;
  }

  protected onInit(): Promise<void> {
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

                PropertyPaneTextField('CourseName', {
                  label: "Course Name",
                  placeholder: "Please Put Course Name"
                }),

                PropertyPaneTextField('CourseCode', {
                  label: "Course Code",
                  placeholder: "Please Put Course Code"
                }),

                PropertyPaneTextField('CourseDesc', {
                  label: "Course Description",
                  placeholder: "Please Put Course Description",
                  multiline: true
                }),

                PropertyPaneSlider('Rating', {
                  label: 'Please rate this course',
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