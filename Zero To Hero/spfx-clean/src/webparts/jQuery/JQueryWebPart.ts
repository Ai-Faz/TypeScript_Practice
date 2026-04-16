import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import MyAccordionTemplate from './MyAccordionTemplate';

// ✅ jQuery FIX
import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';

// CSS Loader
import { SPComponentLoader } from '@microsoft/sp-loader';

export interface IJQueryWebPartProps {
  description: string;
}

export default class JQueryWebPart extends BaseClientSideWebPart<IJQueryWebPartProps> {

  public constructor() {
    super();

    // ✅ jQuery UI CSS
    SPComponentLoader.loadCss(
      'https://code.jquery.com/ui/1.13.2/themes/smoothness/jquery-ui.css'
    );
  }

  public render(): void {
    this.domElement.innerHTML = MyAccordionTemplate.templateHtml;
  }

  // ✅ DROPDOWN TOGGLE LOGIC
  protected onAfterRender(): void {

    const el = this.domElement.querySelector('#accordion');

    if (el) {
      ($(el) as any).accordion({
        collapsible: true,   // ✅ close allowed
        active: false,       // ✅ all closed initially
        heightStyle: "content",
        animate: 200
      });
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
            description: "JQuery Accordion WebPart"
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