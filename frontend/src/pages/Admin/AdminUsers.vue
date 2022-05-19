<template>
    <div class="crud">
        <div class="crud__header">
            <div class="title">Users</div>
        </div>
        <div class="crud__body">
            <q-markup-table seperator="vertical" flat bordered>
                <thead>
                    <tr>
                        <th class="text-left">Email</th>
                        <th class="text-left">Full Name</th>
                        <th class="text-left">Is Verified</th>
                        <th class="text-center" style="width: 150px;"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(current, index) in data" :key="index">
                        <td class="text-left">{{ current.email }}</td>
                        <td class="text-left">{{ current.full_name }}</td>
                        <td class="text-left">{{ current.is_verified ? 'Yes' : 'No' }}</td>
                        <td class="text-center">
                            <q-btn-dropdown color="primary" label="Actions">
                                <q-list>
                                    <q-item clickable v-close-popup @click="verify(current)">
                                        <q-item-section>
                                            <q-item-label>Verify</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-btn-dropdown>
                        </td>
                    </tr>
                </tbody>
            </q-markup-table>
        </div>
    </div>
</template>

<script>
export default
{
    name: 'AdminUsers',
    data: () => 
    ({
        data: null
    }),
    methods:
    {
        async verify(data)
        {
            try
            {
                this.$q.loading.show();

                if (data.is_verified)
                {
                    this.$q.notify(
                    {
                        color: 'red',
                        message: 'This account is already verified.'
                    });

                    return;
                }

                await this.$api.post('admin/verify-user',
                {
                    user_id: data._id
                });

                this.$q.notify(
                {
                    color: 'green',
                    message: 'This account has been successfully verified.'
                });

                this.data = await this.$api.post('admin/list-users').then(res => res.data);
            }
            catch (e)
            {
                this.$q.notify(
                {
                    color: 'red',
                    message: e.response.data
                });
            }
            finally
            {
                this.$q.loading.hide();
            }
        }
    },
    async created()
    {
        this.data = await this.$api.post('admin/list-users').then(res => res.data);
    }
}
</script>
