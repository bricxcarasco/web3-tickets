import Web3 from "web3";
import 'bootstrap/dist/css/bootstrap.css';
import configuration from '../build/contracts/Tickets.json';
import ticketImage from './images/ticket.png';

const createElementFromString = (string) => {
    const div = document.createElement('div');
    div.innerHTML = string.trim();
    return div.firstChild;
}

const CONTRACT_ADDRESS = configuration.networks['5777'].address;
const CONTRACT_ABI = configuration.abi;

const web3 = new Web3(
    Web3.givenProvider || 'http://127.0.0.1:7545'
);

const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

const TOTAL_TICKETS = 10;
const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";
let account;

const accountElement = document.getElementById('account');
const ticketsElement = document.getElementById('tickets');

const buyTicket = async (ticket) => {
    await contract.methods.buyTicket(ticket.id).send({
        from: account,
        value: ticket.price
    });
    await refreshTickets();
}

const refreshTickets = async () => {
    ticketsElement.innerHTML = '';
    for (let i = 0; i < TOTAL_TICKETS; i++) {
        const ticket = await contract.methods.tickets(i).call();
        console.log(ticket);
        ticket.id = i;
        if (ticket.owner === EMPTY_ADDRESS) {
            const ticketElement = createElementFromString(
                `<div class="card ticket" style="width: 18rem;">
                    <img src="${ ticketImage }" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">Ticket Price</h5>
                        <p class="card-text">
                            ${ ticket.price / 1e18 } ETH
                        </p>
                        <button class="btn btn-primary">Buy</button>
                    </div>
                </div>`
            );
            const button = ticketElement.querySelector('button');
            button.onclick = buyTicket.bind(null, ticket);
            ticketsElement.appendChild(ticketElement);
        }
    }
}

const main = async () => {
    const accounts = await web3.eth.requestAccounts();
    account = accounts[0];
    accountElement.innerText = account;
    await refreshTickets();
}

main();