export const AppRoutes = {

    LOG_IN: '/login',
    SIGN_UP: '/signup',

    NOTICES: '/notices',
    NOTICE: '/notice/:id',
    NEW_NOTICE: '/new/notice',
    SETTINGS: 'settings',
    HISTORY: '/history',
    ERROR_PAGE: '/error',

    ROOT: '/'
} as const;

export type AppRoutes = typeof AppRoutes[keyof typeof AppRoutes];