<template>
  <div class="container">
    <img class="head" src="https://cggptsc.blob.core.windows.net/frontend-icon/avatar_GTP.png"/>

    <div class="content">
      <div class="text" v-if="type===1">
        {{content}}
      </div>
      <img class="img" :src="content" v-else-if="type===2" @click="preview(content)"/>
    </div>

  </div>
</template>

<script>
	import ImagePreview from "vant/lib/image-preview";

	export default {
		name: "LeftItem",
		props: ['id', 'type', 'content'],
		methods: {
			preview(url){
				ImagePreview([url])
			}
		}
	}
</script>

<style scoped lang="scss">
  .container {
    display: flex;
    padding: 10px 15px;
    margin-right: 60px;

    .head {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid #eee;
    }

    .content {
      margin-left: 10px;
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
