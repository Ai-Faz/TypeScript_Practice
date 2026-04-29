import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';

import { escape } from '@microsoft/sp-lodash-subset';
import * as strings from 'AcDemoApplicationCustomizerStrings';
import styles from './acDemoNew.module.scss';

const LOG_SOURCE: string = 'AcDemoNewApplicationCustomizer';

/**
 * Properties (from serve.json or tenant config)
 */
export interface IAcDemoNewApplicationCustomizerProperties {
  Top: string;
  Bottom: string;
}

/**
 * Main Extension Class
 */
export default class AcDemoNewApplicationCustomizer
  extends BaseApplicationCustomizer<IAcDemoNewApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;
  private _bottomPlaceholder: PlaceholderContent | undefined;

  /**
   * Entry point
   */
  @override
  public onInit(): Promise<void> {

    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    console.log("✅ EXTENSION LOADED");

    // Listen for placeholder changes
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

    // Initial render
    this._renderPlaceHolders();

    return Promise.resolve();
  }

  /**
   * Render Top & Bottom UI
   */
  private _renderPlaceHolders(): void {

    console.log(
      "🔍 Available Placeholders:",
      this.context.placeholderProvider.placeholderNames
        .map(name => PlaceholderName[name])
        .join(", ")
    );

    /* ===================== TOP ===================== */
    if (!this._topPlaceholder) {

      this._topPlaceholder =
        this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Top,
          { onDispose: this._onDispose }
        );

      if (!this._topPlaceholder) {
        console.error("❌ Top placeholder not found");
      } else {
        const topText: string = this.properties.Top || " Default Top Banner Working";

        if (this._topPlaceholder.domElement) {
          this._topPlaceholder.domElement.innerHTML = `
            <div class="${styles.container}">
              <div class="${styles.topBar}">
                🔥 ${escape(topText)}
              </div>
            </div>`;
        }
      }
    }

    /* ===================== BOTTOM ===================== */
    if (!this._bottomPlaceholder) {

      this._bottomPlaceholder =
        this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Bottom,
          { onDispose: this._onDispose }
        );

      if (!this._bottomPlaceholder) {
        console.error("❌ Bottom placeholder not found");
      } else {
        const bottomText: string = this.properties.Bottom || "💡 Default Bottom Banner Working";

        if (this._bottomPlaceholder.domElement) {
          this._bottomPlaceholder.domElement.innerHTML = `
            <div class="${styles.container}">
              <div class="${styles.bottomBar}">
                ${escape(bottomText)}
              </div>
            </div>`;
        }
      }
    }
  }

  /**
   * Cleanup
   */
  private _onDispose(): void {
    console.log("🧹 Placeholders disposed");
  }
}