import { Log } from '@microsoft/sp-core-library';
import {
  BaseFieldCustomizer,
  IFieldCustomizerCellEventParameters
} from '@microsoft/sp-listview-extensibility';

import * as strings from 'MyFieldCostomizerExtensionFieldCustomizerStrings';
import styles from './MyFieldCostomizerExtensionFieldCustomizer.module.scss';

const LOG_SOURCE: string = 'MyFieldCustomizerExtension';

/**
 * Properties interface
 */
export interface IMyFieldCustomizerExtensionFieldCustomizerProperties {
  sampleText?: string;
}

/**
 * Field Customizer Class
 */
export default class MyFieldCustomizerExtensionFieldCustomizer
  extends BaseFieldCustomizer<IMyFieldCustomizerExtensionFieldCustomizerProperties> {

  /**
   * Init method (runs once)
   */
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, '✅ Field Customizer Initialized');
    console.log("✅ FIELD CUSTOMIZER LOADED");

    return Promise.resolve();
  }

  /**
   * Render each cell
   */
  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {

    const fieldValue: string = event.fieldValue || "No Value";

    // Combine property + actual value
    const displayText: string = this.properties.sampleText
      ? `${this.properties.sampleText} - ${fieldValue}`
      : fieldValue;

    // Dynamic color based on value
    let statusClass: string = styles.default;

    if (fieldValue.toLowerCase() === "completed") {
      statusClass = styles.completed;
    } else if (fieldValue.toLowerCase() === "pending") {
      statusClass = styles.pending;
    } else if (fieldValue.toLowerCase() === "in progress") {
      statusClass = styles.inprogress;
    }

    // Render UI
    event.domElement.innerHTML = `
      <div class="${styles.container}">
        <span class="${statusClass}">
          ${displayText}
        </span>
      </div>
    `;
  }

  /**
   * Cleanup
   */
  public onDisposeCell(event: IFieldCustomizerCellEventParameters): void {
    super.onDisposeCell(event);
  }
}