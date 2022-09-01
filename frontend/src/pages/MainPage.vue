<template>
    <div></div>
</template>

<script>
export default
{
    name: 'MainPage',
    created()
    {
        this.$router.push({ name: 'login' });
    }
}
</script>
