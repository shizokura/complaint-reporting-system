
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
            { name: 'member_dashboard', path: '', component: () => import('pages/Member/MemberDashboard.vue') },
            { name: 'member_create_complaint', path: '', component: () => import('pages/Member/MemberCreateComplaint.vue') },
            { name: 'member_complaint_all', path: '/complaint/all', component: () => import('pages/Member/MemberComplaintAll.vue') },
            { name: 'member_complaint_pending', path: '/complaint/pending', component: () => import('pages/Member/MemberComplaintPending.vue') },
            { name: 'member_complaint_process', path: '/complaint/process', component: () => import('pages/Member/MemberComplaintProcess.vue') },
            { name: 'member_complaint_closed', path: '/complaint/closed', component: () => import('pages/Member/MemberComplaintClosed.vue') },
            { name: 'member_complaint_history', path: '/complaint/history', component: () => import('pages/Member/MemberComplaintHistory.vue') },
            { name: 'member_message', path: '/message', component: () => import('pages/Member/MemberMessage.vue') },
            { name: 'member_user_maintenance', path: '/user_maintenance', component: () => import('pages/Member/MemberUserMaintenance.vue') },
            { name: 'member_change_password', path: '/change_password', component: () => import('pages/Member/MemberChangePassword.vue') }
        ]
    },

    { 
        path: '/verification',
        name: 'verification',
        component: () => import('pages/Member/MemberVerification.vue')
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
            { name: 'admin_complaint_closed', path: '/complaint/closed', component: () => import('pages/Admin/AdminComplaintClosed.vue') },
            { name: 'admin_message', path: '/message', component: () => import('pages/Admin/AdminMessage.vue') },
            { name: 'admin_approval', path: '/approval', component: () => import('pages/Admin/AdminApprovalUsers.vue') },
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

    {
        name: 'forgot',
        path: '/forgot',
        component: () => import('pages/ForgotPassword.vue'),
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue')
    }
]

export default routes
