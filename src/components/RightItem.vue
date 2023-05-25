<template>
  <div class="container">
<!--    <img class="head"-->
<!--         src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1068485212,3292662520&fm=111&gp=0.jpg"/>-->
    <div class="content">
      <div class="text" v-if="type===1" style="word-break: break-all;">
        {{content}}
      </div>
      <img class="img" :src="content" v-else-if="type===2"/>
    </div>
  </div>
</template>

<script>

	export default {
		name: "RightItem",
		props: ['id', 'type', 'content']
	}
</script>

<style scoped lang="scss">
  .container {
    display: flex;
    padding: 10px 15px;
    margin-left: 60px;
    flex-direction: row-reverse;

    .head {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid #eee;
    }

    .content {
      margin-right: 10px;
      margin-top: 10px;

      .text {
        text-align: left;
        display: flex;
        flex-flow: row nowrap;
        width: auto;
        height: auto;
        box-sizing: border-box;
        padding: 5px 12px 7px;
        background: rgb(255, 255, 255);
        border-radius: 4px;
        margin: 5px 5px 5px auto;
        position: relative;
        filter: drop-shadow(rgba(0, 0, 0, 0.14) 0px 4px 8px) drop-shadow(rgba(0, 0, 0, 0.12) 0px 0px 2px);
      }

      .img {
        width: 100px;
        border-bottom-right-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom-left-radius: 10px;
      }
    }

  }
</style>
