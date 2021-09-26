<script lang="ts">
import * as Api from "../Api";
import * as State from "../State";
import { Transaction } from "../Models";
import TransactionsTable from "./TransactionsTable.svelte";

function handleLogout(ev) {
    State.setState({
        ...State.getState(),
        accessToken: null,
    });
    window.location.reload();
}

const appState = State.getState();
const apiClient = Api.makeClient(appState.accessToken);

let transactionsPromise: Promise<Array<Transaction>>;

if (!appState.transactions) {
    transactionsPromise = (async () => {
        const accounts = await apiClient.accounts();
        const transactions = await apiClient.transactions(accounts[0].id);

        State.setState({
            ...State.getState(),
            transactions,
        });

        return transactions;
    })();
} else {
    transactionsPromise = Promise.resolve(appState.transactions);
}
</script>

<main>
    <button on:click={handleLogout}>Logout</button>

    {#await transactionsPromise }
        <p>Loading transactions...</p>
    {:then transactions }
        <TransactionsTable transactions={transactions} />
    {:catch error }
        <p>{error.message}</p>
    {/await}
</main>

<style>
    main {
        text-align: center;
        margin: 0 auto;
    }
</style>