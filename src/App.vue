<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
    const api = `${process.env.API_HOST}/api/${process.env.CUSTOM_PATH}/products`;
    console.log(api);
    this.$http.get(api).then((response) => {
      console.log(response.data)
    })
  }
}
</script>

<style lang="scss">
@import "./assets/index.scss";
</style>
