<template>
    <div class="admin-dashboard">
        <div class="admin-dashboard__body">
            <div class="summary">
                <div @click="$router.push({ name: 'admin_users' })" class="summary__item">
                    <div class="icon"><q-icon name="mdi-account" /></div>
                    <div class="name">({{ registered_users_count }}) Registered Users</div>
                </div>
                <div class="summary__item">
                    <div class="icon"><q-icon name="mdi-alert" /></div>
                    <div class="name">({{ complaints_count }}) Complaint/s</div>
                </div>
                <div class="summary__item">
                    <div class="icon"><q-icon name="mdi-help-rhombus" /></div>
                    <div class="name">({{ pending_complaints_count }}) Pending Complaint/s</div>
                </div>
                <div class="summary__item">
                    <div class="icon"><q-icon name="mdi-progress-clock" /></div>
                    <div class="name">({{ in_process_complaints_count }}) In Process Complaint/s</div>
                </div>
                <div class="summary__item">
                    <div class="icon"><q-icon name="mdi-close-circle-outline" /></div>
                    <div class="name">({{ closed_complaints_count }}) Closed Complaint/s</div>
                </div>
            </div>
            <div class="admin-dashboard__title">Data Analytics</div>
            <div class="admin-dashboard__filter">
                <div>
                    <label>From</label>
                    <q-input v-model="filter.from" outlined type="date" />
                </div>
                <div>
                    <label>To</label>
                    <q-input v-model="filter.to" outlined type="date" />
                </div>
            </div>
            <div class="chart">
                <canvas id="chart_canvas" width="100%"></canvas>
            </div>
            <div class="chart">
                <canvas id="chart_categories_canvas" width="100%" height="400"></canvas>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.admin-dashboard
{
    padding: 25px;
    &__title
    {
        font-size: 2rem;
        margin-bottom: 15px;
        font-weight: 700;
        color: rgba(0,0,0,0.80);
        margin-top: 25px;
    }
    &__filter
    {
        display: grid;
        grid-template-columns: repeat(2, minmax(0,1fr));
        column-gap: 25px;
        label
        {
            margin-bottom: 5px;
            display: block;
        }
    }
    &__body
    {
        .summary
        {
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            text-align: center;
            column-gap: 15px;
            &__item
            {
                background-color: #5588FF;
                padding: 15px;
                border-radius: 5px;
                color: #fff;
                cursor: pointer;
                .icon
                {
                    .q-icon
                    {
                        font-size: 3rem;
                        margin-bottom: 15px;
                    }
                }  
                .name
                {
                    font-weight: 500;
                } 
            }
        }
        .chart
        {
            margin-top: 25px;
            height: 400px;
        }
    }
}
</style>

<script>
import Chart from 'chart.js/auto';
import { query, orderBy, collection, getDocs, where, onSnapshot } from "firebase/firestore"; 
import { shallowRef } from 'vue';

export default
{
    name: 'AdminDashboard',
    data: () => 
    ({
        registered_users_count: 0,
        complaints_count: 0,
        pending_complaints_count: 0,
        in_process_complaints_count: 0,
        closed_complaints_count: 0,
        unsub_users: null,
        unsub_complaints: null,
        chart: null,
        chart_categories: null,
        filter:
        {
            from: null,
            to: null
        }
    }),
    watch:
    {
        'filter.from'()
        {
            if (this.filter.from && this.filter.to)
            {
                this.getComplaints();
            }
        },
        'filter.to'()
        {
            if (this.filter.from && this.filter.to)
            {
                this.getComplaints();
            }
        }
    },
    async mounted()
    {
        // GET TOTAL USERS
        this.getTotalUsers();

        // GET ALL COMPLAINTS
        this.getComplaints();
    },
    methods:
    {
        getTotalUsers()
        {
            if (this.unsub_users) this.unsub_users();
            this.unsub_users = onSnapshot(query(collection(this.$db, "users")), async (snap) => 
            {
                let users = [];

                snap.forEach((doc) => 
                {
                    users.push(Object.assign({}, doc.data(), { id: doc.id }))
                });

                this.registered_users_count = users.length;
            });
        },
        getComplaints()
        {
            const ctx = document.getElementById('chart_canvas');
            const ctx_categories = document.getElementById('chart_categories_canvas');

            if (this.unsub_complaints) this.unsub_complaints();
            this.unsub_complaints = onSnapshot(query(collection(this.$db, "complaints")), async (snap) => 
            {
                let complaints = [];

                snap.forEach((doc) => 
                {
                    complaints.push(Object.assign({}, doc.data(), { id: doc.id }))
                });

                if (this.filter.from && this.filter.to)
                {
                    complaints = complaints.filter(complaint =>
                    {
                        let date_created = new Date(complaint.date);
                        return new Date(this.filter.from) <= date_created && new Date(this.filter.to) >= date_created;
                    });

                    console.log(complaints);
                }

                // FILTER DATA BASED ON STATUS
                this.complaints_count = complaints.length;
                this.pending_complaints_count = complaints.filter(complaint => complaint.status === 'pending').length;
                this.in_process_complaints_count = complaints.filter(complaint => complaint.status === 'process').length;
                this.closed_complaints_count = complaints.filter(complaint => complaint.status === 'closed').length;

                let complaints_by_month = [0,0,0,0,0,0,0,0,0,0,0,0];
                let complaints_by_category = [0,0,0,0,0,0,0,0];
                let categories = ['Communications', 'Humaneness/Caring', 'Institutional Issues', 'Patient Rights', 'Quality', 'Safety', 'Timing and Access', 'Environment'];

                for (let complaint of complaints)
                {
                    complaints_by_month[new Date(complaint.date).getMonth()]++;
                    let category = categories.findIndex(cat => cat === complaint.category);
                    if (category !== -1) complaints_by_category[category]++
                }

                if (this.chart && this.chart_categories)
                {
                    this.chart.data.datasets[0].data = complaints_by_month;
                    this.chart_categories.data.datasets[0].data = complaints_by_category;
                    this.chart.update();
                    this.chart_categories.update();
                }
                else
                {
                    this.chart = shallowRef(new Chart(ctx, 
                    {
                        type: 'bar',
                        data: {
                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                            datasets: [{
                                label: '# of Complaints Per Month',
                                data: complaints_by_month,
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            maintainAspectRatio: false,
                        }
                    }));

                    this.chart_categories = shallowRef(new Chart(ctx_categories, 
                    {
                        type: 'bar',
                        data: {
                            labels: categories,
                            datasets: [{
                                label: '# of Complaints Per Category',
                                data: complaints_by_category,
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)',
                                    'rgba(118, 37, 138, 0.2)',
                                    'rgba(177, 16, 46, 0.2)',
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)',
                                    'rgba(118, 37, 138, 1)',
                                    'rgba(177, 16, 46, 1)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            maintainAspectRatio: false,
                        }
                    }));
                }
            });
        }
    },
    beforeUnmount()
    {
        console.log("Unsub...");
        if (this.unsub_users) this.unsub_users();
        if (this.unsub_complaints) this.unsub_complaints();
    }
}
</script>
