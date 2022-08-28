
const routes = 
[
    {
        path: '/',
        component: () => import('pages/MainPage.vue')
    },

    {
        path: '/member',
        component: () => import('layouts/MainLayout.vue'),
        children: 
        [
            { name: 'member_dashboard', path: '', component: () => import('pages/Member/MemberDashboard.vue') }
        ]
    },

    {
        path: '/admin',
        component: () => import('layouts/AdminLayout.vue'),
        children: 
        [
            { name: 'admin_dashboard', path: '', component: () => import('src/pages/Admin/AdminDashboard.vue') },
            { name: 'admin_users', path: 'users', component: () => import('src/pages/Admin/AdminUsers.vue') },
            { name: 'admin_complaint_pending', path: '/complaint/pending', component: () => import('pages/Admin/AdminComplaintPending.vue') },
            { name: 'admin_complaint_process', path: '/complaint/process', component: () => import('pages/Admin/AdminComplaintProcess.vue') },
            { name: 'admin_complaint_closed', path: '/complaint/closed', component: () => import('pages/Admin/AdminComplaintClosed.vue') }
        ]
    },

    {
        name: 'login',
        path: '/login',
        component: () => import('pages/LoginPage.vue'),
    },

    {
        name: 'register',
        path: '/register',
        component: () => import('pages/RegisterPage.vue'),
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue')
    }
]

export default routes
