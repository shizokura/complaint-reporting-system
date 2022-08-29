<template>
    <div class="member-container">
        <div class="member-container__back">
            <q-btn @click="$router.go(-1)" label="Back" unelevated color="primary" />
        </div>
        <div class="member-container__header">{{ title }}</div>
        <div class="member-container__body">
            <div class="table">
                <div class="table__filter">
                    <div></div>
                    <q-input type="text" bg-color="white" filled placeholder="Search..." />
                </div>
                <div class="table__table">
                    <q-markup-table separator="cell" flat>
                        <thead>
                            <tr>
                                <th class="text-center">#</th>
                                <th class="text-center">Complaint Type</th>
                                <th class="text-center">Creation date</th>
                                <th class="text-center">Status</th>
                                <th class="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody v-if="complaints.length">
                            <tr v-for="(complaint, index) in complaints" :key="index">
                                <td class="text-center">{{ index + 1 }}</td>
                                <td class="text-center">{{ complaint.type }}</td>
                                <td class="text-center">{{ complaint.date }}</td>
                                <td class="text-center" style="text-transform: capitalize;">{{ complaint.status }}</td>
                                <td class="text-center action">
                                    <q-btn @click="view(complaint)" color="primary" label="View" unelevated />
                                    <q-btn @click="remove(complaint)" color="red" label="Delete" unelevated />
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
import { doc, deleteDoc } from "firebase/firestore"; 

export default
{
    name: 'MemberComplaint',
    data: () => 
    ({
        complaints: []
    }),
    props:
    {
        status: String
    },
    computed:
    {
        title()
        {
            if (this.status === 'pending')
            {
                return 'Pending Complaints';
            }
            else if (this.status === 'process')
            {
                return 'In-Process Complaints';
            }
            else if (this.status === 'closed')
            {
                return 'Closed Complaints';
            }
            else if (this.status === 'all')
            {
                return 'Complaints';
            }
            else
            {
                return '';
            }
        }
    },
    methods:
    {
        view(data)
        {
            this.$router.push({ name: 'member_create_complaint', params: data });
        },
        async remove(data)
        {
            this.$q.loading.show(
            {
                message: 'Deleting data...'
            });

            await deleteDoc(doc(this.$db, "complaints", data.id));

            this.complaints = this.complaints.filter(complaint => complaint.id !== data.id);

            this.$q.notify(
            {
                color: 'green',
                message: 'Successfully deleted data'
            });

            this.$q.loading.hide();
        }
    },
    mounted()
    {
        if (!this.$route.params.data)
        {
            this.$router.push({ name: 'member_dashboard' });
            return;
        }

        this.complaints = JSON.parse(this.$route.params.data);
    }
}
</script>
