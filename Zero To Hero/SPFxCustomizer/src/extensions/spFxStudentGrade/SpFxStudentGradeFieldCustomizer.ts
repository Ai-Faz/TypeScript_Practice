import { Log } from '@microsoft/sp-core-library';
import {
  BaseFieldCustomizer,
  type IFieldCustomizerCellEventParameters
} from '@microsoft/sp-listview-extensibility';

export default class SpFxStudentGradeFieldCustomizer
  extends BaseFieldCustomizer<{}> {

  public onInit(): Promise<void> {
    Log.info('SpFxStudentGradeFieldCustomizer', '✅ Initialized');
    return Promise.resolve();
  }

  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {

    const value = event.fieldValue ?? "No Data";

    // 🔥 FINAL HARD-CODE (guaranteed visible)
    event.domElement.innerHTML = `
      <span style="
        background:#0078d4;
        color:white;
        padding:4px 10px;
        border-radius:10px;
        font-size:12px;
        font-weight:600;
      ">
        Student Grade: ${value}
      </span>
    `;
  }

  public onDisposeCell(event: IFieldCustomizerCellEventParameters): void {
    super.onDisposeCell(event);
  }
}