<template>
  <div class="container">
    <img class="head"
         src="https://cggptsc.blob.core.windows.net/frontend-icon/avatar_customer.png"/>
    <div class="content">
      <div class="text" v-if="type===1" style="word-break: break-all;">
        {{content}}
      </div>
      <img class="img" :src="content" v-else-if="type===2"/>
      <div class="file" v-if="type===3">
        <div style="padding: 6px; background: #FFF; display: flex;">
          <img src="https://cggptsc.blob.core.windows.net/frontend-icon/icon-pdf.png"
               style="width: 24px; height: 24px;display: block;margin-top: 2px;">
          <div style="margin-left: 10px;">
            {{content}}
          </div>

        </div>
      </div>
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
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid #eee;
    }

    .content {
      margin-right: 10px;
      margin-top: 10px;

      .text,.file {
        text-align: left;
        display: flex;
        flex-flow: row nowrap;
        width: auto;
        height: auto;
        box-sizing: border-box;
        padding: 5px 12px 7px;
        border-radius: 4px;
        margin: 5px 5px 5px auto;
        position: relative;
        background: #D2F9D1;
        filter: drop-shadow(rgba(0, 0, 0, 0.14) 0px 4px 8px) drop-shadow(rgba(0, 0, 0, 0.12) 0px 0px 2px);
      }
      .file{
        font-size: 14px;
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
