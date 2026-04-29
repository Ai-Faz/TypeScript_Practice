import { Log } from '@microsoft/sp-core-library';
import {
  BaseFieldCustomizer,
  IFieldCustomizerCellEventParameters
} from '@microsoft/sp-listview-extensibility';

import * as strings from 'MyFieldCostomizerExtensionFieldCustomizerStrings';
import styles from './MyFieldCostomizerExtensionFieldCustomizer.module.scss';

const LOG_SOURCE: string = 'MyFieldCustomizerExtension';

export interface IMyFieldCustomizerExtensionFieldCustomizerProperties {
  sampleText?: string;
}

export default class MyFieldCustomizerExtensionFieldCustomizer
  extends BaseFieldCustomizer<IMyFieldCustomizerExtensionFieldCustomizerProperties> {

  public onInit(): Promise<void> {
    // ✅ Now strings is USED (error gone)
    Log.info(LOG_SOURCE, `✅ ${strings.Title} Loaded`);
    return Promise.resolve();
  }

  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {

    const rawValue: string = (event.fieldValue || "").toString();
    const status = rawValue.toLowerCase();

    let value: number = 0;

    // 🔥 Status → Percentage mapping
    if (status === "completed") {
      value = 100;
    } else if (status === "in progress") {
      value = 60;
    } else if (status === "pending") {
      value = 20;
    } else {
      value = 10;
    }

    // 🧠 Final display text
    const displayText = `${rawValue} : ${value}`;

    // 🎨 Render UI
    event.domElement.innerHTML = `
      <div class="${styles.container}">
        
        <div class="${styles.text}">
          ${displayText}
        </div>

        <div class="${styles.barBackground}">
          <div class="${styles.barFill}" style="width:${value}%">
            ${value}%
          </div>
        </div>

      </div>
    `;
  }

  public onDisposeCell(event: IFieldCustomizerCellEventParameters): void {
    super.onDisposeCell(event);
  }
}