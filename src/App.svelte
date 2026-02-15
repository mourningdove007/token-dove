<script>
  import Router from 'svelte-spa-router';
  import Ledger from './pages/Ledger.svelte';
    import SignOn from './pages/SignOn.svelte';
    import Home from './pages/Home.svelte';
    import Tokens from './pages/Tokens.svelte';
    import Create from './pages/Create.svelte';

  const routes = {
    '/': SignOn,
    '/ledger': Ledger,
    '/home': Home,
    '/tokens': Tokens,
    '/create': Create,
  };
</script>

<Router {routes} />