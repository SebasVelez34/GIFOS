const template = document.createElement('template');
  template.innerHTML = `
  <style>
    ::slotted(img) {
      width: 100%;
    }
  </style>
  <slot name="image"></slot>
`;
class GIFCardMobile extends HTMLElement {
    constructor() {
        super();
        let shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
        this.addEventListener('click', e => {
          if (this.disabled) {
            return;
          }
        });
    }

    static get observedAttributes() {
        return ['mobile', 'desktop'];
    }

}

customElements.define('gif-card-m', GIFCardMobile);