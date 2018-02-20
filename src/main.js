import Vue from 'vue'

import 'isomorphic-fetch'

import { ApolloClient, createNetworkInterface } from 'apollo-client'
//import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'

const networkInterface = createNetworkInterface({
  uri: 'http://data.coinspec.info/graphql',
})

/*const wsClient = new SubscriptionClient('ws://data.coinspec.info/subscriptions', {
  reconnect: false, // true
})

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
)*/

const apolloClient = new ApolloClient({
  networkInterface: networkInterface, //WithSubscriptions,
  connectToDevTools: true,
})

import VueApollo from 'vue-apollo'
Vue.use(VueApollo)

let loading = 0

const apolloProvider = new VueApollo({
  clients: {
    a: apolloClient,
  },
  defaultClient: apolloClient,
  defaultOptions: {
    // $loadingKey: 'loading',
  },
  watchLoading (state, mod) {
    loading += mod
    console.log('Global loading', loading, mod)
  },
  errorHandler (error) {
    console.log('Global error handler')
    console.error(error)
  },
})


import routes from './routes'

const app = new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      const matchingView = routes[this.currentRoute]
      return matchingView
        ? require('./pages/' + matchingView + '.vue')
        : require('./pages/404.vue')
    }
  },
  render: h => h(this.ViewComponent),
  apolloProvider,
})

window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname
})

