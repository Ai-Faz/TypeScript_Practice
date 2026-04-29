import * as React from 'react';
import styles from './RShowListItems.module.scss';
import type { IRShowListItemsProps } from './IRShowListItemsProps';

/**
 * Interface for a single SharePoint list item
 * Defines the structure of data coming from SharePoint
 */
interface IListItem {
  Title: string;
  Id: number;
  SoftwareName: string;
}

/**
 * State interface for the component
 * Stores all fetched list items
 */
export interface IRShowListItemsWPState {
  ListItems: IListItem[];
}

/**
 * React Class Component (SPFx)
 * This component fetches and displays SharePoint list items
 */
export default class RShowListItems extends React.Component<IRShowListItemsProps, IRShowListItemsWPState> {

  // Static variable to store site URL
  static siteurl: string = "";

  /**
   * Constructor
   * - Called first when component is created
   * - Used to initialize state
   */
  constructor(props: IRShowListItemsProps) {
    super(props);

    // Initialize state with empty array
    this.state = {
      ListItems: []
    };

    // Assign site URL from props
    RShowListItems.siteurl = this.props.websiteurl;

    console.log("Constructor executed");
  }

  /**
   * componentDidMount
   * - Called after component is rendered in DOM
   * - Best place for API calls / data fetching
   */
  public componentDidMount(): void {
    console.log("componentDidMount executed");

    // Fetch data from SharePoint list using REST API
    fetch(`${RShowListItems.siteurl}/_api/web/lists/getbytitle('MicrosoftSoftware')/items`, {
      headers: {
        'Accept': 'application/json;odata=nometadata'
      }
    })
      .then(response => response.json())
      .then(data => {

        // Update state with fetched data
        this.setState({
          ListItems: data.value
        });

        console.log("Data fetched successfully");
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }

  /**
   * componentWillUnmount
   * - Called just before component is removed from DOM
   * - Used for cleanup (if needed)
   */
  public componentWillUnmount(): void {
    console.log("componentWillUnmount executed");
  }

  /**
   * render method
   * - Responsible for displaying UI
   * - Runs whenever state or props change
   */
  public render(): React.ReactElement<IRShowListItemsProps> {
    return (
      <div className={styles.rShowListItems}>

        <h2>Microsoft Software List</h2>

        {/* ================= TABLE VIEW ================= */}
        <table className={styles.row}>
          <thead>
            <tr>
              <th>Title</th>
              <th>ID</th>
              <th>Software Name</th>
            </tr>
          </thead>

          <tbody>
            {
              // Loop through state data using map
              this.state.ListItems.map((item) => {

                // Create dynamic SharePoint item URL
                const fullurl = `${RShowListItems.siteurl}/lists/MicrosoftSoftware/DispForm.aspx?ID=${item.Id}`;

                return (
                  <tr key={item.Id}>
                    <td>
                      {/* Link to open item details */}
                      <a href={fullurl}>{item.Title}</a>
                    </td>

                    <td>{item.Id}</td>

                    <td>{item.SoftwareName}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>

        {/* ================= ORDERED LIST VIEW ================= */}
        <ol>
          {
            // Render same data in list format
            this.state.ListItems.map((item) => {

              const fullurl = `${RShowListItems.siteurl}/lists/MicrosoftSoftware/DispForm.aspx?ID=${item.Id}`;

              return (
                <li key={item.Id}>
                  <a href={fullurl}>
                    {item.Title}, {item.Id}, {item.SoftwareName}
                  </a>
                </li>
              );
            })
          }
        </ol>

      </div>
    );
  }
}