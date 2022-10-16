<template>
    <div class="admin-dashboard">
        <div class="admin-dashboard__title">Data Analytics</div>
        <div class="admin-dashboard__body">
            <div class="summary">
                <div class="summary__item">
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
            <div class="chart">
                <canvas id="chart_canvas" width="100%" height="400"></canvas>
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
                background-color: #883DFF;
                padding: 15px;
                border-radius: 5px;
                color: #fff;
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
        }
    }
}
</style>

<script>
import Chart from 'chart.js/auto';
import { query, orderBy, collection, getDocs, where } from "firebase/firestore"; 

export default
{
    name: 'AdminDashboard',
    data: () => 
    ({
        registered_users_count: 0,
        complaints_count: 0,
        pending_complaints_count: 0,
        in_process_complaints_count: 0,
        closed_complaints_count: 0
    }),
    async mounted()
    {
        const ctx = document.getElementById('chart_canvas');

        // GET TOTAL USERS
        let users = await getDocs(query(collection(this.$db, "users"))).then(res => res.docs.map(doc => Object.assign({}, doc.data(), { id: doc.id })));
        this.registered_users_count = users.length;

        // GET ALL COMPLAINTS
        let complaints = await getDocs(query(collection(this.$db, "complaints"))).then(res => res.docs.map(doc => Object.assign({}, doc.data(), { id: doc.id })));

        // FILTER DATA BASED ON STATUS
        this.complaints_count = complaints.length;
        this.pending_complaints_count = complaints.filter(complaint => complaint.status === 'pending').length;
        this.in_process_complaints_count = complaints.filter(complaint => complaint.status === 'process').length;
        this.closed_complaints_count = complaints.filter(complaint => complaint.status === 'closed').length;

        let complaints_by_month = [0,0,0,0,0,0,0,0,0,0,0,0];

        for (let complaint of complaints)
        {
            complaints_by_month[new Date(complaint.date).getMonth()]++;
        }

        const myChart = new Chart(ctx, 
        {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: '# of Complaints',
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
                }
            }
        });
    }
}
</script>
