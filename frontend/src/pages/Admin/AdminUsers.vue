<template>
    <div class="admin-container">
        <div class="admin-container__back">
            <q-btn @click="$router.go(-1)" color="primary" unelevated label="Back" no-caps />
        </div>
        <div class="admin-container__header">User Data</div>
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
                                <th class="text-center">First Name</th>
                                <th class="text-center">Last Name</th>
                                <th class="text-center">Birthday</th>
                                <th class="text-center">Gender</th>
                                <th class="text-center">Phone no.</th>
                                <th class="text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-center">1</td>
                                <td class="text-center">Joan</td>
                                <td class="text-center">Dela Cruz</td>
                                <td class="text-center">April 16, 1991</td>
                                <td class="text-center">Gender</td>
                                <td class="text-center">09971276494</td>
                                <td class="text-center">
                                    <q-btn style="margin-right: 15px;" color="primary" label="Update" unelevated />
                                    <q-btn color="red" label="Delete" unelevated />
                                </td>
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
