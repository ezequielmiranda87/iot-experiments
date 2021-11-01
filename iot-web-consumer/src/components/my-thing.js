import { LitElement, html, css } from 'lit-element';
import { client } from '../js/graphql-client.js'

class MyThing extends LitElement {

    constructor() {
        super();
        this.client = client
        this.title = 'My IoT Device';
        this.subTitle = 'Realtime Data:';
        this.image = '/demo/images/rpi-logo.png';
        this.IoTData = {}

        this.graphQLSubscribe()

        this.addEventListener('subscription-fired', async (e) => {
            this.IoTData = e.detail.subscribe2sensor
        })
    }

    set IoTData(val) {
        let oldVal = this._IoTData;
        this._IoTData = val;
        this.requestUpdate('IoTData', oldVal);
    }

    get IoTData() { return this._IoTData; }


    async graphQLSubscribe() {

        let unsubscribe = () => { };

        const onNext = ({ data }) => {
            let newMessage = new CustomEvent('subscription-fired', {
                detail: data
            });
            this.dispatchEvent(newMessage);
        };

        let onError = (err) => { console.log(err); };

        return await new Promise((resolve, reject) => {
            unsubscribe = client.subscribe(
                {
                    query: "subscription { subscribe2sensor {temp, humid, time}}",
                },
                {
                    next: onNext,
                    error: onError,
                    complete: resolve,
                }
            );
        });
    }

    async graphqlQuery() {
        const result = await new Promise((resolve, reject) => {
            let result;
            client.subscribe(
                {
                    query: "{ sensors }",
                },
                {
                    next: (data) => (result = data),
                    error: reject,
                    complete: () => resolve(result),
                }
            );
        });
        console.log(result)
        return result
    }

    connectedCallback() {
        super.connectedCallback()
    }

    render() {
        return html`
        <div class="card">
            <div class="img-container">
                <img src=${this.image} alt="Avatar" style="width:100%">
            </div>

            <div class="data-container">
            <h4><b>${this.title}</b></h4>
            <p>${this.subTitle}</p>

            <div class="div-table">
                <div class="div-table-body">
                    <div class="div-table-row">
                        <div class="div-table-cell">Temperature</div>
                        <div class="div-table-cell">${this.IoTData.temp?.toFixed(2)}</div>
                    </div>
                    <div class="div-table-row">
                        <div class="div-table-cell">Humidity</div>
                        <div class="div-table-cell">${this.IoTData.humid?.toFixed(2)}</div>
                    </div>
                    <div class="div-table-row">
                    <div class="div-table-cell">Time:</div>
                        <div class="div-table-cell">${this.IoTData.time}</div>
                    </div>
                </div>
            </div>
            </div>
        </div>
      </div>
      `;
    }

    static get styles() {
        return css`
            .card {
                padding:16px;
                max-width: 400px;
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                transition: 0.3s;
                border-radius: 5px;
                margin: auto;
                width: 50%;
            }

            img {
                max-width:200px;
                border-radius: 5px 5px 0 0;
            }

            .img-container {
                text-align:center;
            }

            .data-container{
                border-top:1px solid black;
                margin:8px;
            }

            .div-table{
                display: table;
                width: 100%;
            }

            .div-table-row {
                display: table-row;                 
            }
            .div-table-cell, .div-table-head {
                display: table-cell;
            }

            .div-table-body {
                display: table-row-group;
            }

        `;
    }
}

customElements.define('my-thing', MyThing);