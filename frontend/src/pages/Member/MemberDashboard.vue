<template>
    <div class="member-dashboard">
        <div class="member-dashboard__body">
            <template v-if="!is_loading">
                <div class="summary">
                    <div @click="$router.push({ name: 'member_complaint_all', params: { data: JSON.stringify(all_complaints) } })" class="summary__item">
                        <div class="icon"><q-icon name="mdi-alert" /></div>
                        <div class="name">({{ this.all_complaints.length }}) Complaint/s</div>
                    </div>
                    <div @click="$router.push({ name: 'member_complaint_pending', params: { data: JSON.stringify(pending_complaints) } })" class="summary__item">
                        <div class="icon"><q-icon name="mdi-help-rhombus" /></div>
                        <div class="name">({{ this.pending_complaints.length }}) Pending Complaint/s</div>
                    </div>
                    <div @click="$router.push({ name: 'member_complaint_process', params: { data: JSON.stringify(in_process_complaints) } })" class="summary__item">
                        <div class="icon"><q-icon name="mdi-progress-clock" /></div>
                        <div class="name">({{ this.in_process_complaints.length }}) In Process Complaint/s</div>
                    </div>
                    <div @click="$router.push({ name: 'member_complaint_closed', params: { data: JSON.stringify(closed_complaints) } })" class="summary__item">
                        <div class="icon"><q-icon name="mdi-close-circle-outline" /></div>
                        <div class="name">({{ this.closed_complaints.length }}) Closed Complaint/s</div>
                    </div>
                </div>
            </template>
            <div v-else style="text-align: center;">
                <q-spinner
                    color="primary"
                    size="3em"
                />
            </div>
        </div>
    </div>
</template>

<script>
import './MemberDashboard.scss';
import { query, orderBy, collection, getDocs, where, onSnapshot } from "firebase/firestore"; 

export default
{
    name: 'MemberDashboard',
    data: () => 
    ({
        all_complaints: [],
        pending_complaints: [],
        in_process_complaints: [],
        closed_complaints: [],
        is_loading: true,
        unsub: null
    }),
    async mounted()
    {
        await this.getCount();
    },
    methods:
    {
        async getCount()
        {
            let user_data = JSON.parse(localStorage.getItem('user_data'));
            
            this.unsub = onSnapshot(query(collection(this.$db, "complaints"), orderBy("id_number"), where("user_id", "==", user_data.id)), (res) =>
            {
                this.all_complaints = res.docs.map(doc => Object.assign({}, doc.data(), { id: doc.id }));
                this.pending_complaints = this.all_complaints.filter(complaint => complaint.status === 'pending');
                this.in_process_complaints = this.all_complaints.filter(complaint => complaint.status === 'process');
                this.closed_complaints = this.all_complaints.filter(complaint => complaint.status === 'closed');
                this.is_loading = false;
            });

            // this.all_complaints = await getDocs(query(collection(this.$db, "complaints"), orderBy("id_number"), where("user_id", "==", user_data.id))).then(res => res.docs.map(doc => Object.assign({}, doc.data(), { id: doc.id })));
            // this.pending_complaints = this.all_complaints.filter(complaint => complaint.status === 'pending');
            // this.in_process_complaints = this.all_complaints.filter(complaint => complaint.status === 'process');
            // this.closed_complaints = this.all_complaints.filter(complaint => complaint.status === 'closed');
            // this.is_loading = false;
        }
    },
    beforeUnmount()
    {
        console.log("Unsub...");
        if (this.unsub) this.unsub();
    }
}
</script>
