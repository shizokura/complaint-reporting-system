<template>
    <div class="member-container">
        <div class="member-container__header">Complaint History</div>
        <div class="member-container__body">
            <!-- <div class="clipboard">
                <q-btn label="Copy" no-caps unelevated color="primary" />
                <q-btn label="Paste" no-caps unelevated color="primary" />
            </div> -->
            <div class="table">
                <div class="table__filter">
                    <div></div>
                    <q-input v-model="search" type="text" bg-color="white" filled placeholder="Search..." />
                </div>
                <div class="table__table">
                    <q-markup-table separator="cell" flat>
                        <thead>
                            <tr>
                                <th class="text-center">Complaint File #</th>
                                <!-- <th class="text-center">Complaint Type</th> -->
                                <th class="text-center">Creation Date</th>
                                <th class="text-center">Status</th>
                                <th class="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody v-if="complaints.length">
                            <tr v-for="(complaint, index) in complaints_filtered" :key="index">
                                <td class="text-center">{{ complaint.id_number.toString().padStart(5, '0') }}</td>
                                <!-- <td class="text-center">{{ complaint.type }}</td> -->
                                <td class="text-center">{{ complaint.date }}</td>
                                <td class="text-center" style="text-transform: capitalize;">{{ complaint.status }}</td>
                                <td class="text-center">
                                    <q-btn style="margin-right: 15px;" @click="view(complaint)" label="View" unelevated color="primary" />
                                    <q-btn :disabled="complaint.status !== 'closed' && complaint.status !== 'cancelled' ? false : true" @click="cancel(complaint)" label="Cancel" unelevated color="red" />
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="5" style="text-align: center;">No data available</td>
                            </tr>
                        </tbody>
                    </q-markup-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { query, orderBy, collection, getDocs, where, onSnapshot, setDoc, doc } from "firebase/firestore"; 

export default
{
    name: 'MemberComplaint',
    data: () => 
    ({
        complaints: [],
        search: '',
        unsub: null
    }),
    props:
    {
        status: String
    },
    computed:
    {
        complaints_filtered()
        {
            return this.complaints.filter(complaint => complaint.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1);
        }
    },
    methods:
    {
        view(data)
        {
            this.$router.push({ name: 'member_create_complaint', params: data });
        },
        async cancel(data)
        {
            if (data.status !== 'closed' && data.status !== 'cancelled')
            {
                this.$q.loading.show();

                await setDoc(doc(this.$db, "complaints", data.id),
                {
                    status: 'cancelled'
                }, 
                { merge: true });

                let admins = await getDocs(query(collection(this.$db, "users"), where("role", "==", "Admin"))).then(res => res.docs.map(doc => Object.assign({}, doc.data(), { id: doc.id })));
                
                await Promise.all(admins.map(async admin => 
                {
                    await this.$_createNotification(
                    { 
                        title: 'Complaint Cancelled',
                        message: `Complaint #${ data.id_number } has been cancelled.`,
                        user_id: admin.id
                    });
                }));

                this.$q.loading.hide();
            }
        }
    },
    async mounted()
    {
        this.$q.loading.show({
            message: "Loading data..."
        });
        let user_data = JSON.parse(localStorage.getItem('user_data'));
        // this.complaints = await getDocs(query(collection(this.$db, "complaints"), orderBy("id_number"), where("user_id", "==", user_data.id))).then(res => res.docs.map(doc => Object.assign({}, doc.data(), { id: doc.id })));

        this.unsub = onSnapshot(query(collection(this.$db, "complaints"), orderBy("id_number"), where("user_id", "==", user_data.id)), (res) =>
        {
            this.complaints = res.docs.map(doc => Object.assign({}, doc.data(), { id: doc.id }));
            this.$q.loading.hide();
        });
    },
    beforeUnmount()
    {
        console.log("Unsub...");
        if (this.unsub) this.unsub();
    }
}
</script>
