(function(window, document, undefined) {
    // Refers to the "importer", which is index.html
    var thatDoc = document;

    // Refers to the "imported", which is dc-btn/dc-btn.html
    var thisDoc =  (thatDoc._currentScript || thatDoc.currentScript).ownerDocument;

    // Gets content from <template>
    var template = thisDoc.querySelector('template').content;

    // Creates an object based in the HTML Element prototype
    var DcBtn = Object.create(HTMLElement.prototype);

    // Creates the "modifiers" attribute and sets a default value
    DcBtn.modifiers = '';

    // Fires when an instance of the element is created
    DcBtn.createdCallback = function() {
        // Creates the shadow root
        var shadowRoot = this.createShadowRoot();
        // Adds a template clone into shadow root
        var clone = thatDoc.importNode(template, true);
        shadowRoot.appendChild(clone);

        // Caches <button> DOM query
        this.button = shadowRoot.querySelector('button');

        // Checks if the "modifiers" attribute has been overwritten
        if (this.hasAttribute('modifiers')) {
            var modifiers = this.getAttribute('modifiers');
            this.setModifiers(modifiers);
        }
        else {
            this.setModifiers(this.modifiers);
        }
    };
    // Fires when an attribute was added, removed, or updated
    DcBtn.attributeChangedCallback = function(attr, oldVal, newVal) {
        if (attr === 'modifiers') {
            this.setModifiers(newVal);
        }
    };

    DcBtn.modifierClass = function (modifier) {
        return 'dc-btn--'+ modifier.trim();
    };

    DcBtn.updatesModifiersClasses = function (modifiers, action) {
        modifiers.split(' ').forEach(function (modifier) {
            this.button.classList[action](this.modifierClass(modifier));
        }.bind(this));
    };

    // Sets new value to "modifiers" attribute
    DcBtn.setModifiers = function(newVal) {
        this.updatesModifiersClasses(this.modifiers, 'remove'); // remove old modifiers
        this.updatesModifiersClasses(newVal, 'add'); // add new modifiers
        this.modifiers = newVal;
    };

    // Registers <dc-btn> in the main document
    thatDoc.registerElement('dc-btn', {
        prototype: DcBtn
    });
})(window, document);
