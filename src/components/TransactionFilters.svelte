<script lang="ts">
import type { Writable } from "svelte/store";
import { searchTerm, caseSensitiveSearch, startDate, startTime, endDate, endTime, incomingOutgoing, IncomingOutgoingFilterChoices } from "../Store";
import { DatePicker, Switch, Tabs, TextField, TimePicker } from "attractions";
import { SearchIcon } from "svelte-feather-icons";
import { setState } from "../State";

const setDate = (stateVar: Writable<Date>) => (ev: CustomEvent<{ value: Date }>) => {
    stateVar.set(ev.detail.value);
};
</script>

<main>
    <div class="incoming-outgoing">
        <Tabs
            name="incoming-outgoing-both"
            items={IncomingOutgoingFilterChoices.concat()}
            bind:value={$incomingOutgoing}
        />
    </div>
    <div class="search">
        <TextField
            bind:value={$searchTerm}
            type="search"
            label="Search"
            outline
            withItem
        >
            <SearchIcon size="24" class="item" />
        </TextField>
        <Switch
            bind:value={$caseSensitiveSearch}
        >
            <span class="ml">Case sensitive</span>
        </Switch>
    </div>
    <div class="datetime">
        <DatePicker on:change={setDate(startDate)} locale="en-GB" format="%d/%m/%Y" />
        <TimePicker on:change={setDate(startTime)} format="%H:%M:%S" />
        <span>to</span>
        <DatePicker on:change={setDate(endDate)} locale="en-GB" format="%d/%m/%Y" />
        <TimePicker on:change={setDate(endTime)} format="%H:%M:%S" />
    </div>
</main>

<style>
    main {
        padding-top: 20px;
        max-width: 500px;
        margin: 0 auto;
    }

    div:not(:first-child) {
        margin-top: 10px;
    }
    
    .incoming-outgoing {
        max-width: 250px;
        margin: 0 auto;
    }

    .search {
        display: grid;
        grid-template-columns: 65% auto;
        column-gap: 20px;
    }

    .ml {
        margin-left: 10px;
    }
</style>