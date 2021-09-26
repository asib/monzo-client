<script lang="ts">
    import { Transaction } from "../Models";
    import { Table } from "attractions";
    import { formatCreatedDate } from "../Store";

    export let transactions: Array<Transaction>;

    const headers = [
        { text: "Amount", value: "amount" },
        { text: "Created", value: "created" },
        { text: "Description", value: "description" },
    ];

    $: items = transactions.map(transaction => ({
        amount: transaction.amount,
        created: formatCreatedDate(transaction.created),
        description: transaction.description,
    }));
</script>

<main>
    <Table {headers} {items} />
</main>

<style>
    main {
        padding-top: 20px;
        max-width: 700px;
        overflow-x: scroll;
        margin: 0 auto;
    }
</style>