const app = new Vue({
  el: '#app',
  data: {
    addresses: [],
    selectedIndex: 0,
  },
  watch: {
  },
  methods: {
    fetchBalances(addresses) {
      Promise.all(addresses.map(address => (
        Promise.all([

          // fetch asset and token balances
          axios.get(`https://platform.o3.network/api/v1/neo/${address}/balances`)
          .then(response => response.data && response.data.result && response.data.result.data),

          // fetch unclaimed gas
          axios.get(`https://platform.o3.network/api/v1/neo/${address}/claimablegas`)
          .then(response => response.data && response.data.result && response.data.result.data && response.data.result.data.gas),
        ])
        .then(results => {
          const balances = results[0];
          const unclaimedGas = results[1];

          const assets = balances.assets && balances.assets.reduce((accum, asset) => {
            accum[asset.symbol] = asset.value;
            return accum;
          }, {});

          const tokens = balances.nep5Tokens && balances.nep5Tokens.map(token => {
            const {
              id,
              name,
              symbol,
              decimals,
              value,
            } = token;

            return {
              id,
              name,
              symbol,
              balance: decimals == 0 ? value : value / Math.pow(10, decimals),
            }
          });

          return {
            address,
            assets,
            unclaimedGas,
            tokens,
          }
        })
      )))
      .then(results => {
        this.addresses = results
      });
    },
    loadData(){
      const addresses = window.location.hash && window.location.hash.replace('#', '').split(',');
      this.fetchBalances(addresses);
    },
  },
  mounted() {
    this.loadData();
  },
});
