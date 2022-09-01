<template>
    <div class="member-container">
        <div class="member-container__header">Complaint History</div>
        <div class="member-container__body">
            <div class="clipboard">
                <q-btn label="Copy" no-caps unelevated color="primary" />
                <q-btn label="Paste" no-caps unelevated color="primary" />
            </div>
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
                                <td class="text-center">{{ complaint.id_number }}</td>
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

    },
    methods:
    {

    },
    mounted()
    {

    }
}
</script>
