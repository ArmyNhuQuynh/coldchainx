
const path = (root: string, sublink: string) => {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_MANAGER_DASHBOARD = '/manager/dashboard';
const ROOTS_ADMIN_DASHBOARD = '/admin/dashboard';

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  logout: path(ROOTS_AUTH, '/logout'),
};

export const PATH_MANAGER_DASHBOARD = {
  root: ROOTS_MANAGER_DASHBOARD,

  general: {
    app: path(ROOTS_MANAGER_DASHBOARD, "/general"),
  },
  category: {
    root: path(ROOTS_MANAGER_DASHBOARD, '/category'),
    create: path(ROOTS_MANAGER_DASHBOARD, '/category/new'),
    edit: (id: string) => path(ROOTS_MANAGER_DASHBOARD, `/category/${id}`),
  },
  shipment: {
    root: path(ROOTS_MANAGER_DASHBOARD, '/shipment'),
    edit: (id: string) => path(ROOTS_MANAGER_DASHBOARD, `/shipment/${id}`),
  },
}


export const PATH_ADMIN_DASHBOARD = {
  root: ROOTS_ADMIN_DASHBOARD,

  general: {
    app: path(ROOTS_ADMIN_DASHBOARD, "/general"),
    ecommerce: path(ROOTS_ADMIN_DASHBOARD, "/ecommerce"),
  },


  brand: {
    root: path(ROOTS_ADMIN_DASHBOARD, "/brand"),
    create: path(ROOTS_ADMIN_DASHBOARD, "/brand/new"),
    edit: (id: string) => path(ROOTS_ADMIN_DASHBOARD, `/brand/${id}`),
  },
};
