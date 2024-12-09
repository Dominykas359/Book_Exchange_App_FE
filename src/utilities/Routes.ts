export const AppRoutes = {

    LOG_IN: '/login',
    SIGN_UP: '/signup',

    NOTICES: '/notices',
    NOTICE: '/notice',
    NEW_NOTICE: '/new/notice',
    SETTINGS: '/settings',
    HISTORY: '/history',
    CHATS: '/chats',
    CHAT: '/chat',
    CHATPUBLISHER: '/chat-from-publisher',
    ERROR_PAGE: '/error',
    COMMENTS: '/comments',

    ROOT: '/'
} as const;

export type AppRoutes = typeof AppRoutes[keyof typeof AppRoutes];