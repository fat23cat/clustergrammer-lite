import Clastergrammer from '../src/main.js';

const clastergrammer = Clastergrammer({
  root: '#clust_container',
  network_data: {
    row_nodes: [{ name: 'FOO' }, { name: 'BAR' }],
    col_nodes: [{ name: 'BOO' }, { name: 'BAZ' }],
    links: []
  },
  tile_colors: ['#2F80ED', '#2F80ED']
});
