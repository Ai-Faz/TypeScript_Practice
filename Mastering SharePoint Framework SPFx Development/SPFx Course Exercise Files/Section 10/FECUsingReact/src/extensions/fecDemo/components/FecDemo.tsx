import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import * as React from 'react';

import styles from './FecDemo.module.scss';

export interface IFecDemoProps {
  text: string;
}

const LOG_SOURCE: string = 'FecDemo';

export default class FecDemo extends React.Component<IFecDemoProps, {}> {
  @override
  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: FecDemo mounted');
  }

  @override
  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: FecDemo unmounted');
  }

  @override
  public render(): React.ReactElement<{}> {


    const mystyles = {
      color: 'blue',
      width:  `${this.props.text}px`,
      background: 'red'

    }

    return (
      <div className={styles.FecDemo}>

                  <div className={styles.cell}>
                  <div style={mystyles}>                  
                    { this.props.text }%
                  </div>
                  </div>
      
      </div>
    );
  }


    
  }

