<template>
    <div>MAIN PAGE</div>
</template>

<script>
export default
{
    name: 'MainPage',
    created()
    {
        this.$router.push({ name: 'member_dashboard' });
    }
}
</script>
