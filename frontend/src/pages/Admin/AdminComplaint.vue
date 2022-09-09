<template>
    <div class="admin-container">
        <div class="admin-container__back">
            <q-btn @click="$router.go(-1)" color="primary" unelevated label="Back" no-caps />
        </div>
        <div class="admin-container__header">{{ title }}</div>
        <div class="admin-container__body">
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
                                <th class="text-center">Complainant</th>
                                <th class="text-center">Complaint Type</th>
                                <th class="text-center">Creation date</th>
                                <th class="text-center">Status</th>
                                <th class="text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-center">1</td>
                                <td class="text-center">Juan Dela Cruz</td>
                                <td class="text-center">Environment</td>
                                <td class="text-center">April 18, 2022</td>
                                <td class="text-center">Pending</td>
                                <td class="text-center"><q-btn @click="detail_dialog = true" color="primary" label="View" unelevated /></td>
                            </tr>
                        </tbody>
                    </q-markup-table>
                </div>
            </div>
        </div>

        <q-dialog v-model="detail_dialog" :maximized="true">
            <div style="background-color: #fff;">
                <div class="admin-container">
                    <q-btn @click="detail_dialog = false" class="admin-container__back" color="primary" unelevated label="Back" no-caps />
                    <div class="admin-container__header">Complaints Details</div>
                    <div class="admin-container__body">
                        <div class="view-complaint">
                            <div class="item">
                                <div class="item__label">Complaints No. #:</div>
                                <div class="item__value">220323-1</div>
                            </div>
                            <div class="item">
                                <div class="item__label">Complaints Type:</div>
                                <div class="item__value">Pending</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </q-dialog>
    </div>
</template>

<script>
import './AdminComplaint.scss';

export default
{
    name: 'AdminComplaint',
    data: () =>
    ({
        detail_dialog: false
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
            else
            {
                return '';
            }
        }
    },
    mounted()
    {

    }
}
</script>
