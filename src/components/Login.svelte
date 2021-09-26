<script lang="ts">
    export let handleLogin: (event) => void;
</script>

<form on:submit|preventDefault={handleLogin}>
    <input type="text" placeholder="Client ID" name="clientId" id="clientId" />
    <br />
    <input type="password" placeholder="Client Secret" name="clientSecret" id="clientSecret" />
    <br />
    <button type="submit">Login</button>
</form>