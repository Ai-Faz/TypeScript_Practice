export default class MyAccordionTemplate {
  public static templateHtml: string = `
    <div>
      <h2 style="text-align:center; margin-bottom:15px;">Jquery Accordion</h2>

      <div id="accordion">
        
        <h3>Section 1</h3>
        <div>
          <p>
            Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque.
            Vivamus nisi metus, molestie vel, gravida in, condimentum sit amet, nunc.
            Nam a nibh. Donec suscipit eros.
          </p>
        </div>

        <h3>Section 2</h3>
        <div>
          <p>
            Sed non urna. Donec et ante. Phasellus eu ligula. Vestibulum sit amet purus.
            Vivamus hendrerit, dolor at aliquet laoreet.
          </p>
        </div>

        <h3>Section 3</h3>
        <div>
          <p>
            Nam enim risus, molestie et, porta ac, aliquam ac, risus.
          </p>
          <ul>
            <li>List item one</li>
            <li>List item two</li>
            <li>List item three</li>
          </ul>
        </div>

        <h3>Section 4</h3>
        <div>
          <p>
            Cras dictum. Pellentesque habitant morbi tristique senectus et netus.
          </p>
        </div>

      </div>
    </div>
  `;
}