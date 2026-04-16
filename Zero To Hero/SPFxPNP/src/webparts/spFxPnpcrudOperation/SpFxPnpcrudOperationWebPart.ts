import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import styles from './SpFxPnpcrudOperationWebPart.module.scss';

// ✅ PnP v3 imports
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export default class SpFxPnpcrudOperationWebPart extends BaseClientSideWebPart<{}> {

  private _sp: any;

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.container}">
        <h2 class="${styles.heading}">Student Management</h2>

        <table class="${styles.table}">
          <tr>
            <td>Student Id</td>
            <td><input type="text" id="studentId" /></td>
            <td><button id="btnGet">Get</button></td>
          </tr>

          <tr>
            <td>Name</td>
            <td><input type="text" id="txtstudentname" /></td>
          </tr>

          <tr>
            <td>Department</td>
            <td><input type="text" id="txtstudentDept" /></td>
          </tr>

          <tr>
            <td>City</td>
            <td><input type="text" id="txtStudcity" /></td>
          </tr>

          <tr>
            <td colspan="2">
              <button id="btnInsert">Insert</button>
              <button id="btnUpdate">Update</button>
              <button id="btnDelete">Delete</button>
            </td>
          </tr>
        </table>

        <div id="MsgStatus" class="${styles.status}"></div>
      </div>
    `;

    this.bindEvents();
  }

  // ✅ PnP setup (v3)
  protected onInit(): Promise<void> {
    return super.onInit().then(() => {
      this._sp = spfi().using(SPFx(this.context));
    });
  }

  private bindEvents(): void {
    this.domElement.querySelector('#btnInsert')
      ?.addEventListener('click', () => this.insertStudent());

    this.domElement.querySelector('#btnGet')
      ?.addEventListener('click', () => this.getStudent());

    this.domElement.querySelector('#btnUpdate')
      ?.addEventListener('click', () => this.updateStudent());

    this.domElement.querySelector('#btnDelete')
      ?.addEventListener('click', () => this.deleteStudent());
  }

  // ✅ INSERT
  private insertStudent(): void {
    const name = (document.getElementById("txtstudentname") as HTMLInputElement).value;
    const dept = (document.getElementById("txtstudentDept") as HTMLInputElement).value;
    const city = (document.getElementById("txtStudcity") as HTMLInputElement).value;

    this._sp.web.lists.getByTitle("Students").items.add({
      Title: name,
      StudName: name,
      StudDept: dept,
      StudCity: city
    }).then(() => {
      this.showMessage("Inserted successfully ✅");
    }).catch((err: any) => {
      console.error(err);
      this.showMessage("Error inserting ❌");
    });
  }

  // ✅ GET
  private getStudent(): void {
    const id = Number((document.getElementById("studentId") as HTMLInputElement).value);

    this._sp.web.lists.getByTitle("Students").items.getById(id)()
      .then((item: any) => {
        (document.getElementById("txtstudentname") as HTMLInputElement).value = item.StudName;
        (document.getElementById("txtstudentDept") as HTMLInputElement).value = item.StudDept;
        (document.getElementById("txtStudcity") as HTMLInputElement).value = item.StudCity;

        this.showMessage("Data fetched ✅");
      }).catch(() => {
        this.showMessage("Item not found ❌");
      });
  }

  // ✅ UPDATE
  private updateStudent(): void {
    const id = Number((document.getElementById("studentId") as HTMLInputElement).value);
    const name = (document.getElementById("txtstudentname") as HTMLInputElement).value;
    const dept = (document.getElementById("txtstudentDept") as HTMLInputElement).value;
    const city = (document.getElementById("txtStudcity") as HTMLInputElement).value;

    this._sp.web.lists.getByTitle("Students").items.getById(id).update({
      StudName: name,
      StudDept: dept,
      StudCity: city
    }).then(() => {
      this.showMessage("Updated successfully ✅");
    }).catch(() => {
      this.showMessage("Update failed ❌");
    });
  }

  // ✅ DELETE
  private deleteStudent(): void {
    const id = Number((document.getElementById("studentId") as HTMLInputElement).value);

    this._sp.web.lists.getByTitle("Students").items.getById(id).delete()
      .then(() => {
        this.showMessage("Deleted successfully ✅");
      }).catch(() => {
        this.showMessage("Delete failed ❌");
      });
  }

  private showMessage(msg: string): void {
    const el = document.getElementById("MsgStatus");
    if (el) el.innerHTML = msg;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}