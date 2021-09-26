<script lang="ts">
import { searchTerm, caseSensitiveSearch } from "../Store";
</script>

<main>
    <input type="text" placeholder="Search" bind:value={$searchTerm} />
    <input type="checkbox" bind:checked={$caseSensitiveSearch} />
</main>