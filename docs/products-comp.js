class ProductsComp extends HTMLElement {
    static get observedAttributes() {
        return ['data-request'];
    }
    constructor() {
        super();

        this.addEventListener('change', e => {
            if (e.target.type === "checkbox") {
                console.log(">>> change evt recd: ", e.target.type);
                let atleastOneChecked = false;
                for (let el of this.getElementsByTagName('input')) {
                    if (el.checked) {
                        atleastOneChecked = true;
                        break;
                    }
                }
                document.getElementById("productsCompBtn").disabled = !atleastOneChecked;
            }


        });

        this.addEventListener('click', e => {
            if (e.target.type === "submit") {
                console.log(">>> click evt recd: ", e.target.type);
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

    attributeChangedCallback(name, oldVal, newVal) {

        // if (newVal != null && newVal != undefined && newVal.length > 0 && name === 'data-request') {
        //     let data = JSON.parse(newVal);
        //     if (data != null && data.action === 'create') {
        //         this.innerHTML += this.createCheckboxElement(data);
        //     } else if (data != null && data.action === 'delete') {
        //         for (let i of data.values) {
        //             this.removeChild(document.getElementById("div" + i));
        //         }
        //     } else if (data != null && data.action === 'update') {
        //         //we are sending a data response below
        //         for (let el of this.getElementsByTagName('input')) {
        //             if (!el.checked) {
        //                 el.removeAttribute("checked");
        //             }
        //             else {
        //                 let attr = document.createAttribute("checked");
        //                 el.setAttributeNode(attr);
        //             }
        //         }
        //     }

        //     //update data-response
        //     //get the selectedItems and itemsCount
        //     let nodesArray = Array.from(this.getElementsByTagName('input'));

        //     let total = nodesArray.length;
        //     let selected = nodesArray.filter(n => n.checked).map(n => Number(n.value));
        //     let allItems = nodesArray.map(n => Number(n.value));
        //     let maxVal = Math.max(...allItems);
        //     let resp = { itemsCount: total, selectedItems: selected, maxId: maxVal }
        //     this.setAttribute("data-response", JSON.stringify(resp));
        // }
    }

    createProductsApp() {

        return `<div class="pure-g">
            <div class="pure-u-1-3"><img src="apple.jpg" height="150" width="150"><br />
            <span style="color: black;">Apple $1.00/lb</span> 
            <input type="checkbox" name="fruits" value="apple">
            </div>
            <div class="pure-u-1-3"><img src="kiwi.jpg" height="150" width="150"><br />
            <span style="color: black;">Kiwi $2.00/lb</span> <input type="checkbox" name="fruits" value="kiwi">
            </div>
            <div class="pure-u-1-3"><img src="orange.jpg" height="150" width="150"><br />
            <span style="color: black;">Orange $1.00/lb</span> <input type="checkbox" name="fruits" value="orange">
            </div>
        </div>
        <p><button id="productsCompBtn" class="pure-button" disabled>Add to Cart</button></p>`;
    }
}
window.customElements.define('products-comp', ProductsComp);