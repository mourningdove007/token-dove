<script>
  import Router from 'svelte-spa-router';
  import Ledger from './pages/Ledger.svelte';
    import SignOn from './pages/SignOn.svelte';
    import Home from './pages/Home.svelte';

  const routes = {
    '/': SignOn,
    '/ledger': Ledger,
    '/home': Home,
  };
</script>

<Router {routes} />