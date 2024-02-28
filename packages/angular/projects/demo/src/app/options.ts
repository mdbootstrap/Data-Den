/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataDenDefaultCellRenderer, DataDenHeaderSelectFilterRenderer, DataDenOptions, DataDen } from 'data-den-core';
import data from './data.js';

class TextClippingCellRenderer {
  value;
  constructor(data: any) {
    this.value = data.value;
  }
  getGui() {
    if (this.value.length < 100) {
      const el = document.createElement('span');
      el.classList.add('demo-text-clipping-cell');
      el.innerText = this.value.toString().replace(/\n/g, ' ');

      return el;
    }

    const el = document.createElement('span');
    el.classList.add('demo-text-clipping-cell');
    el.setAttribute('data-mdb-toggle', 'tooltip');
    el.setAttribute('title', this.value);
    el.innerText = this.value.toString().replace(/\n/g, ' ').substring(0, 100) + '...';

    const wrapper = document.createElement('div');
    wrapper.classList.add('demo-text-clipping-cell-wrapper');
    wrapper.classList.add('position-relative');
    wrapper.appendChild(el);

    return wrapper;
  }
}

class PostIdCellRenderer {
  value;
  constructor(data: any) {
    this.value = data.value;
  }
  getGui() {
    const template = document.createElement('template');
    template.innerHTML = `
        <div class="dd-post-id-cell">
          <span class="dd-post-id-cell__value">${this.value}</span>
          <a href="#" class="dd-post-id-cell__button"><i class="fas fa-up-right-from-square"></i></a>
        </div>
      `;

    const button = template.content.querySelector('a');
    this.addEventListeners(button);

    const el = template.content.firstElementChild! as HTMLElement;

    return el;
  }

  addEventListeners(el: any) {
    el.addEventListener('click', (e: any) => {
      e.preventDefault();
      const randomNumber = Math.floor(Math.random() * 10) + 1;

      fetch(`https://jsonplaceholder.typicode.com/comments?postId=${randomNumber}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('data', data);
          const el = document.getElementById('dd-details-table')!;
          el.innerHTML = '';

          console.log('element', el);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const dataDen = new DataDen(el, {
            columns: [
              {
                field: 'postId',
                headerName: 'Post ID',
                width: 100,
                resize: true,
                filter: false,
                cellRenderer: DataDenDefaultCellRenderer,
              },
              {
                field: 'id',
                headerName: 'Comment ID',
                width: 150,
                resize: true,
                sort: true,
                filter: false,
                cellRenderer: DataDenDefaultCellRenderer,
              },
              {
                field: 'name',
                headerName: 'User name',
                width: 600,
                resize: true,
                sort: true,
                filter: true,
                filterOptions: {
                  method: 'includes',
                  debounceTime: 300,
                  caseSensitive: false,
                },
                cellRenderer: TextClippingCellRenderer,
              },
              {
                field: 'email',
                headerName: 'User email',
                width: 600,
                resize: true,
                sort: true,
                filter: true,
                filterOptions: {
                  method: 'includes',
                  debounceTime: 300,
                  caseSensitive: false,
                },
                cellRenderer: DataDenDefaultCellRenderer,
              },
              {
                field: 'body',
                headerName: 'Body',
                width: 950,
                resize: true,
                filter: true,
                filterOptions: {
                  method: 'includes',
                  debounceTime: 300,
                  caseSensitive: false,
                },
                cellRenderer: TextClippingCellRenderer,
              },
            ],
            rows: data,
            draggable: true,
            rowHeight: 50,
          });

          console.log('data den', dataDen);
        });
    });
  }
}

class PackageCellRenderer {
  value: any;
  constructor(data: any) {
    this.value = data.value;
  }

  getBackgroundColor() {
    switch (this.value) {
      case 'Gold':
        return '#FFD700';
      case 'Platinum':
        return '#90EE90';
      case 'Silver':
        return '#A9A9A9';
      case 'Diamond':
        return '#BA55D3';
      default:
        return '';
    }
  }

  getGui() {
    const backgroundColor = this.getBackgroundColor();
    const template = document.createElement('div');
    template.className = 'dd-post-id-cell align-items-center justify-content-center';

    if (backgroundColor) {
      template.style.backgroundColor = backgroundColor;
    }

    template.textContent = this.value;

    return template;
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export const options: DataDenOptions = {
  columns: [
    {
      field: 'login',
      headerName: 'Login',
      sort: false,
      filter: false,
      filterOptions: {
        method: 'includes',
        debounceTime: 500,
        caseSensitive: false,
      },
      resize: true,
      width: 100,
      cellRenderer: DataDenDefaultCellRenderer,
    },
    {
      field: 'sid',
      headerName: 'SID',
      sort: true,
      filter: true,
      filterOptions: {
        method: 'includes',
        debounceTime: 500,
        caseSensitive: false,
      },
      resize: true,
      width: 120,
      cellRenderer: PostIdCellRenderer,
    },
    {
      field: 'sponsorId',
      headerName: 'Sponsor ID',
      sort: true,
      filter: true,
      filterOptions: {
        method: 'includes',
        debounceTime: 500,
        caseSensitive: false,
      },
      resize: true,
      width: 140,
      cellRenderer: DataDenDefaultCellRenderer,
    },
    {
      field: 'pfCompanyName',
      headerName: 'PF Company Name',
      sort: true,
      filter: true,
      filterOptions: {
        method: 'includes',
        debounceTime: 500,
        caseSensitive: false,
      },
      resize: false,
      width: 280,
      cellRenderer: DataDenDefaultCellRenderer,
    },
    {
      field: 'package',
      headerName: 'Package',
      sort: true,
      filter: true,
      filterRenderer: DataDenHeaderSelectFilterRenderer,
      filterOptions: {
        method: 'includes',
        debounceTime: 300,
        listOptions: [...new Set(data.map((row) => row.cell[4]))].map((pkg) => ({
          label: `${pkg}`,
          value: `${pkg.toLowerCase()}`,
        })),
      },
      resize: false,
      width: 180,
      cellRenderer: PackageCellRenderer,
    },
    {
      field: 'sponsorStatus',
      headerName: 'Sponsor Status',
      sort: true,
      filter: true,
      filterRenderer: DataDenHeaderSelectFilterRenderer,
      filterOptions: {
        method: 'includes',
        debounceTime: 300,
        listOptions: [...new Set(data.map((row) => row.cell[5]))].map((sponsorStatus) => ({
          label: `${sponsorStatus}`,
          value: `${sponsorStatus.toLowerCase()}`,
        })),
      },
      resize: false,
      width: 170,
      cellRenderer: DataDenDefaultCellRenderer,
    },

    {
      field: 'adminNotes',
      headerName: 'Admin Notes',
      sort: false,
      filter: true,
      filterOptions: {
        method: 'includes',
        debounceTime: 500,
        caseSensitive: false,
      },
      resize: false,
      width: 150,
      cellRenderer: DataDenDefaultCellRenderer,
    },
    {
      field: 'financialStatus',
      headerName: 'Financial Status',
      sort: false,
      filter: true,
      filterOptions: {
        method: 'includes',
        debounceTime: 500,
        caseSensitive: false,
      },
      resize: false,
      width: 180,
      cellRenderer: DataDenDefaultCellRenderer,
    },
    {
      field: 'packageCost',
      headerName: 'Package Cost',
      sort: false,
      filter: true,
      filterOptions: {
        method: 'includes',
        debounceTime: 500,
        caseSensitive: false,
      },
      resize: false,
      width: 160,
      cellRenderer: DataDenDefaultCellRenderer,
    },
    {
      field: 'packagePaid',
      headerName: 'Package Paid',
      sort: false,
      filter: true,
      filterOptions: {
        method: 'includes',
        debounceTime: 500,
        caseSensitive: false,
      },
      resize: false,
      width: 160,
      cellRenderer: DataDenDefaultCellRenderer,
    },

    {
      field: 'boothNo',
      headerName: 'Booth #',
      sort: false,
      filter: true,
      filterRenderer: DataDenHeaderSelectFilterRenderer,
      filterOptions: {
        method: 'includes',
        debounceTime: 300,
        listOptions: [...new Set(data.map((row) => row.cell[15]))].map((boothNo) => ({
          label: `${boothNo}`,
          value: `${boothNo.toLowerCase()}`,
        })),
      },
      resize: false,
      width: 120,
      cellRenderer: DataDenDefaultCellRenderer,
    },
  ],
  rows: data.map((row) => {
    return {
      login: row.cell[0],
      sid: row.cell[1],
      sponsorId: row.cell[2],
      pfCompanyName: row.cell[3],
      package: row.cell[4],
      sponsorStatus: row.cell[5],
      adminNotes: row.cell[7],
      financialStatus: row.cell[8],
      packageCost: row.cell[9],
      packagePaid: row.cell[10],
      boothNo: row.cell[15],
    };
  }),
  draggable: true,
  rowHeight: 50,
  pagination: true,
  paginationOptions: {
    pageSize: 10,
    ofText: 'of',
  },
};
