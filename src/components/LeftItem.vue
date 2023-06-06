<template>
  <div class="container">
    <img class="head" src="https://cggptsc.blob.core.windows.net/frontend-icon/avatar_GTP.png"/>

    <div class="content">
      <div class="text" v-if="type===1">
        {{content}}
      </div>
<!--      <img class="img" :src="content" v-else-if="type===2" @click="preview(content)"/>-->
      <img class="img" src="https://avatars.githubusercontent.com/u/23027848?v=4" @click="preview('https://avatars.githubusercontent.com/u/23027848?v=4')"/>

    </div>

  </div>
</template>

<script>

	export default {
		name: "LeftItem",
		props: ['id', 'type', 'content'],
		methods: {
			preview(imageUrl){
				const image = new Image();
				image.src = imageUrl;
				image.onload = () => {
					// 创建弹出层
					const previewContainer = document.createElement('div');
					previewContainer.style.position = 'fixed';
					previewContainer.style.top = 0;
					previewContainer.style.bottom = 0;
					previewContainer.style.left = 0;
					previewContainer.style.right = 0;
					previewContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
					previewContainer.style.display = 'flex';
					previewContainer.style.justifyContent = 'center';
					previewContainer.style.alignItems = 'center';
					document.body.appendChild(previewContainer);
					// 在弹出层中添加图片
					const previewImage = document.createElement('img');
					previewImage.src = imageUrl;
					previewImage.style.maxWidth = '80%';
					previewImage.style.maxHeight = '80%';
					previewContainer.appendChild(previewImage);
					// 点击弹出层，关闭预览
					previewContainer.addEventListener('click', () => {
						document.body.removeChild(previewContainer);
					});
				};
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
        white-space: pre-line;
        filter: drop-shadow(rgba(0, 0, 0, 0.14) 0px 4px 8px) drop-shadow(rgba(0, 0, 0, 0.12) 0px 0px 2px);
      }

      .img {
        width: 200px;
        border-bottom-right-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom-left-radius: 10px;
      }
    }

  }
</style>
