
const path = (root: string, sublink: string) => {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_MANAGER_DASHBOARD = '/manager/dashboard';
const ROOTS_ADMIN_DASHBOARD = '/admin/dashboard';
const ROOTS_SALE_DASHBOARD = '/sale/dashboard';
const ROOTS_DISPATCHER_DASHBOARD = '/dispatcher/dashboard';

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
  
  shipment: {
    root: path(ROOTS_MANAGER_DASHBOARD, '/shipment'),
    create: path(ROOTS_MANAGER_DASHBOARD, '/shipment/new'),
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

  vehicle: {
    root: path(ROOTS_ADMIN_DASHBOARD, "/vehicle"),
    create: path(ROOTS_ADMIN_DASHBOARD, "/vehicle/new"),
    detail: (id: string) => path(ROOTS_ADMIN_DASHBOARD, `/vehicle/${id}`),
    edit: (id: string) => path(ROOTS_ADMIN_DASHBOARD, `/vehicle/${id}/edit`),
  },

  warehouse: {
    root: path(ROOTS_ADMIN_DASHBOARD, "/warehouse"),
    create: path(ROOTS_ADMIN_DASHBOARD, "/warehouse/new"),
    detail: (id: string) => path(ROOTS_ADMIN_DASHBOARD, `/warehouse/${id}`),
    edit: (id: string) => path(ROOTS_ADMIN_DASHBOARD, `/warehouse/${id}/edit`),
  },

  route: {
    root: path(ROOTS_ADMIN_DASHBOARD, "/route"),
    create: path(ROOTS_ADMIN_DASHBOARD, "/route/new"),
    detail: (id: string) => path(ROOTS_ADMIN_DASHBOARD, `/route/${id}`),
    edit: (id: string) => path(ROOTS_ADMIN_DASHBOARD, `/route/${id}/edit`),
  },

  driver: {
    root: path(ROOTS_ADMIN_DASHBOARD, "/driver"),
    detail: (id: string) => path(ROOTS_ADMIN_DASHBOARD, `/driver/${id}`),
  },

  user: {
    root: path(ROOTS_ADMIN_DASHBOARD, "/user"),
    detail: (id: string) => path(ROOTS_ADMIN_DASHBOARD, `/user/${id}`),
  },
};

export const PATH_SALE_DASHBOARD = {
  root: ROOTS_SALE_DASHBOARD,

  general: {
    app: path(ROOTS_SALE_DASHBOARD, "/general"),
  },
  shipment: {
    root: path(ROOTS_SALE_DASHBOARD, '/shipment'),
    edit: (id: string) => path(ROOTS_SALE_DASHBOARD, `/shipment/${id}`),
  },
  incident: {
    root: path(ROOTS_SALE_DASHBOARD, '/incident'),
    detail: (id: string) => path(ROOTS_SALE_DASHBOARD, `/incident/${id}`),
  },
};

export const PATH_DISPATCHER_DASHBOARD = {
  root: ROOTS_DISPATCHER_DASHBOARD,

  general: {
    app: path(ROOTS_DISPATCHER_DASHBOARD, "/general"),
  },
  dispatch: {
    root: path(ROOTS_DISPATCHER_DASHBOARD, "/dispatch"),
  },
  trip: {
    root: path(ROOTS_DISPATCHER_DASHBOARD, "/trips"),
  },
  tracking: {
    root: path(ROOTS_DISPATCHER_DASHBOARD, "/tracking"),
    detail: (id: string) => path(ROOTS_DISPATCHER_DASHBOARD, `/tracking/${id}`),
  },
  shipment: {
    root: path(ROOTS_DISPATCHER_DASHBOARD, '/shipment'),
    edit: (id: string) => path(ROOTS_DISPATCHER_DASHBOARD, `/shipment/${id}`),
  },
};
