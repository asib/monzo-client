<script lang="ts">
    import Login from "./components/Login.svelte";
	import Dashboard from "./components/Dashboard.svelte";
	import * as Api from "./Api";
	import * as State from "./State";

	const apiClient: Api.Client = Api.makeClient();
	const appState: State.AppState | null = State.getState();

	const urlParams = new URLSearchParams(window.location.search);
	const authorizationCode: string | null = urlParams.get("code");

	let accessTokenPromise;
	if (authorizationCode) {
		if (!appState) {
			accessTokenPromise = Promise.reject("could not retrieve app state");
		} else {
			accessTokenPromise = apiClient.getAccessToken(appState.clientId, appState.clientSecret, authorizationCode).then(token => {
				if (token) {
					State.setState({
						...appState,
						accessToken: token,
					})
				}

				window.history.pushState({}, document.title, window.location.pathname);

				return true;
			});
		}
	}
</script>

<main>
	<h1>Monzo Client</h1>
	{#if authorizationCode }
		{#await accessTokenPromise then accessTokenSuccess } 
			{#if accessTokenSuccess }
				<p>Give access to this app through the Monzo app, then refresh the page.</p>
			{:else}
				<p>Failed to retrieve access token: {accessTokenSuccess}</p>
			{/if}
		{:catch error }
			<p>{error.message}</p>
		{/await}
	{:else if appState && appState.accessToken }
		<Dashboard />
	{:else}
		<Login handleLogin={
			async (ev) => {
				const clientId = ev.target.clientId.value;
				const clientSecret = ev.target.clientSecret.value;

				State.setState({
					clientId,
					clientSecret,
				});
				await apiClient.login(clientId);
			}
		} />
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff4d56;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>