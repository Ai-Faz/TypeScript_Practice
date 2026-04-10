import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

// Template import (ONLY ONE)
import MyAccordionTemplate from './MyAccordionTemplate';

// jQuery & jQuery UI
import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/accordion';

// CSS Loader
import { SPComponentLoader } from '@microsoft/sp-loader';

import styles from './JQueryWebPart.module.scss';
import * as strings from 'JQueryWebPartStrings';

export interface IJQueryWebPartProps {
  description: string;
}

export default class JQueryWebPart extends BaseClientSideWebPart<IJQueryWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public constructor() {
    super();
    // Load jQuery UI CSS
    SPComponentLoader.loadCss(
      'https://code.jquery.com/ui/1.13.2/themes/smoothness/jquery-ui.css'
    );
  }

  public render(): void {
    // Inject HTML
    this.domElement.innerHTML = MyAccordionTemplate.templateHtml;

    // Accordion options
    const accordionOptions: any = {
      animate: true,
      collapsible: false,
      icons: {
        header: 'ui-icon-circle-e',
        activeHeader: 'ui-icon-circle-s'
      }
    };

    // Apply accordion
    ($('.accordion', this.domElement) as any).accordion(accordionOptions);
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
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentTeams
                : strings.AppTeamsTabEnvironment;
              break;

            default:
              throw new Error('Unknown host');
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}