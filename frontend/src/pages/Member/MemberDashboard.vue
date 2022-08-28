<template>
    <div class="member-dashboard">
        <div class="member-dashboard__title">Data Analytics</div>
        <div class="member-dashboard__body">
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

<script>
import './MemberDashboard.scss';

export default
{
    name: 'MemberDashboard'
}
</script>
