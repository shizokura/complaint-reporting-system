<template>
    <div class="admin-dashboard">
        <div class="admin-dashboard__title">Data Analytics</div>
        <div class="admin-dashboard__body">
            <div class="summary">
                <div class="summary__item">
                    <div class="icon"><q-icon name="mdi-account" /></div>
                    <div class="name">(0) Registered Users</div>
                </div>
                <div class="summary__item">
                    <div class="icon"><q-icon name="mdi-alert" /></div>
                    <div class="name">(0) Complaint/s</div>
                </div>
                <div class="summary__item">
                    <div class="icon"><q-icon name="mdi-help-rhombus" /></div>
                    <div class="name">(0) Pending Complaint/s</div>
                </div>
                <div class="summary__item">
                    <div class="icon"><q-icon name="mdi-progress-clock" /></div>
                    <div class="name">(0) In Process Complaint/s</div>
                </div>
                <div class="summary__item">
                    <div class="icon"><q-icon name="mdi-close-circle-outline" /></div>
                    <div class="name">(0) Closed Complaint/s</div>
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
                background-color: #1976D2;
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

export default
{
    name: 'AdminDashboard',
    mounted()
    {
        const ctx = document.getElementById('chart_canvas');

        const myChart = new Chart(ctx, 
        {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: '# of Complaints',
                    data: [12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3],
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
