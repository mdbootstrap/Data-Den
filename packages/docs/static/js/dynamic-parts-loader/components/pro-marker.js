'use strict';

import { DPL } from '../dynamic-parts-loader.js';

export const proComponentMarkerId = DPL.defineComponent({
  selector: '#dpl-newmdb-pro-component-marker',
  template: (userData) => {
    if (userData.isProSubscription) {
      return `<a href="/profile/my-orders/" role="button">
    <i class="far fa-xs fa-gem ms-1 text-danger"></i>
</a>`;
    } else {
      return `<a data-mdb-ripple-init class="btn btn-danger ripple-surface" href="/docs/standard/pro" role="button">
    MDB Pro component <i class="far fa-gem ms-1"></i>
</a>`;
    }
  },
});

export const proComponentMarkerClass = DPL.defineComponent({
  selector: '.dpl-newmdb-pro-component-marker',
  template: (userData) => {
    if (userData.isProSubscription) {
      return `<a href="/profile/my-orders/" role="button">
    <i class="far fa-xs fa-gem ms-1 text-danger"></i>
</a>`;
    } else {
      return `<a class="btn btn-danger ripple-surface" href="/docs/standard/pro" role="button">
    MDB Pro component <i class="far fa-gem ms-1"></i>
</a>`;
    }
  },
});
