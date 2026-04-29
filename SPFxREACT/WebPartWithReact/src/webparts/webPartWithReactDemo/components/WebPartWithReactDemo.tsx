import * as React from 'react';
import styles from './WebPartWithReactDemo.module.scss';
import type { IWebPartWithReactDemoProps } from './IWebPartWithReactDemoProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class WebPartWithReactDemo extends React.Component<IWebPartWithReactDemoProps, {}> {
  public render(): React.ReactElement<IWebPartWithReactDemoProps> {
    const {
      hasTeamsContext,
    } = this.props;

    return (
      <section className={`${styles.webPartWithReactDemo} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>

          <p className="${styles.description}">Aboslute URL {escape(this.props.absoluteurl)}</p>
          <p className="${styles.description}">Title {escape(this.props.sitetitle)}</p>
          <p className="${styles.description}">Relative URL {escape(this.props.relativeurl)}</p>
          <p className="${styles.description}">Username {escape(this.props.username)}</p>

        </div>
    
      </section>
    );
  }
}
