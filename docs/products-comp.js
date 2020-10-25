class ProductsComp extends HTMLElement {
    constructor() {
        super();

        this.addEventListener('change', e => {
            if (e.target.type === "checkbox") {
                let atleastOneChecked = false;
                for (let el of this.getElementsByTagName('input')) {
                    if (el.checked) {
                        atleastOneChecked = true;
                        break;
                    }
                }
                //document.getElementById("productsCompBtn").disabled = !atleastOneChecked;
            }
        });

        this.addEventListener('click', e => {
            if (e.target.type === "submit") {
                let selectedFruits = new Array();
                for (let el of this.getElementsByTagName('input')) {
                    if (el.checked) {
                        selectedFruits.push(el.getAttribute("value"));
                    }
                };
                if (selectedFruits.length > 0) {
                    this.dispatchEvent(
                        new CustomEvent('selectedFruits', {
                            detail: selectedFruits
                        })
                    );
                }
            }
        });

    }

    connectedCallback() {
        this.innerHTML += this.createProductsApp();
    }

    createProductsApp() {

        return `<div>
        <div class="row row-cols-3">
            <div class="col-sm"><img src="apple.jpg" height="150" width="150"><br />
            <span style="color: black;">Apple $1.00/lb</span> 
            <input type="checkbox" name="fruits" value="apple">
            </div>
            <div class="col-sm"><img src="kiwi.jpg" height="150" width="150"><br />
            <span style="color: black;">Kiwi $2.00/lb</span> <input type="checkbox" name="fruits" value="kiwi">
            </div>
            <div class="col-sm"><img src="orange.jpg" height="150" width="150"><br />
            <span style="color: black;">Orange $1.00/lb</span> <input type="checkbox" name="fruits" value="orange">
            </div>
            </div>
        </div>
        <div class="row row row-cols-3"><div class="col-sm">&nbsp;</div></div>
        <div class="row row-cols-3"><div class="col-sm d-flex justify-content-center">
        <p><button id="productsCompBtn" class="btn btn-primary">Add to Cart</button></p></div></div>`;
    }
}
window.customElements.define('products-comp', ProductsComp);