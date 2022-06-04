<template>
    <div class="member-dashboard">
        <div class="member-dashboard__title">Dashboard</div>
        <div class="member-dashboard__body">
            <div class="summary">
                <div class="summary__item">
                    <div class="icon"></div>
                    <div class="name">(0) Complaint/s</div>
                </div>
                <div class="summary__item">
                    <div class="icon"></div>
                    <div class="name">(0) Pending Complaint/s</div>
                </div>
                <div class="summary__item">
                    <div class="icon"></div>
                    <div class="name">(0) In Process Complaint/s</div>
                </div>
                <div class="summary__item">
                    <div class="icon"></div>
                    <div class="name">(0) Closed Complaint/s</div>
                </div>
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
