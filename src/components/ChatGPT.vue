<template>
  <div class="container">
    <div class="top">
      <img src="https://cggptsc.blob.core.windows.net/frontend-icon/icon-back.png"
           style="width: 20px;height: 20px;position: absolute;left: 20px;"
           @click="$router.go(-1)"/>
      Azure Open AI ChatGpt Demo
<!--      <div style="text-align: right; color: #929292; padding-right: 14px;">-->
<!--        配额：{{use_count}}/{{all_count}}-->
<!--      </div>-->
    </div>
    <div class="list" id="list" ref="list" >
      <ul id="chatContainer">
        <li v-for="(item,index) in msglist" :key="index">
          <RightItem :id="item.id" :type="item.type" :content="item.content" v-if="item.me"></RightItem>
          <LeftItem :id="item.id" :type="item.type" :content="item.content" v-else></LeftItem>

        </li>
      </ul>
    </div>
    <div class="bottom">
<!--      <div class="line"></div>-->
      <div class="input-send">
        <div v-if="$route.query.robot_type == 'company_info'">
          <input type="file" id="company_file" name="company_file" accept=".pdf" multiple @change="changeFile"
                 style="display: none">
          <img class="uplod-file"
                  src="https://cggptsc.blob.core.windows.net/frontend-icon/icon_upload.png"
                @click="uploadFileTrigger"/>
        </div>
        <input v-model="text" placeholder="输入您的问题..." class="input" @keyup.enter="send"/>
        <button plain type="info" :class="text ? 'send' : 'cannotsend'" @click="send">发送</button>

      </div>
<!--      <div class="comment">-->
<!--        Copyright @ Cloud MS 团队，仅供内部试用-->
<!--        <div>-->
<!--          本站点前端由Open AI生成，人工校准。申请更多配额请联系：shuzhen.yu@capgemini.com-->
<!--        </div>-->
<!--      </div>-->

    </div>

  </div>
</template>

<script>
	import {getChatResponse} from "@/api/ApiChat";
	import {CountInfo} from "@/api/CountInfo";
	import LeftItem from "@/components/LeftItem";
	import RightItem from "@/components/RightItem";
	import { useToast } from "vue-toastification";
	import { useRouter } from "vue-router";
	import { BlobServiceClient } from "@azure/storage-blob";

	export default {
		components: {LeftItem, RightItem},
		setup() {
			// Get toast interface
			const toast = useToast();
			const router = useRouter();
			// Make it available inside methods
      // var query_params = router.currentRoute.value.query
      // console.log(query_params)
      // console.log(query_params.robot_type)
			return { toast, router }

		},
		data: () => {
			return {
				text: '',
        all_count: 0,
        use_count: 0,
        robot_type: "assistant",
        file_urls: [],
				msglist: [{
					id: 1,
					type: 1,
					content: 'Hello, how may I assist you?',
					me: false
				}]
			}
		},
		beforeCreate() {
			document.querySelector('body').setAttribute('style', 'background-color:#F2F4F6')
		},
		beforeUnmount() {
			document.body.removeAttribute('style')
		},
    mounted(){
			// this.getUseCount()
    },
		watch: {
			msglist: {
				handler() {
					this.$nextTick(() => {
						var container = this.$el.querySelector("#chatContainer");
						container.scrollTop = container.scrollHeight;
						window.scrollTo(0, document.body.scrollHeight);
					})
				},
				deep: true
			}
		},
		methods: {
			uploadFileTrigger(){
				document.getElementById("company_file").click();
      },
			changeFile(event){
				// capture file into state
        console.log(event)
        let files = event.target.files
				for (var i = 0; i < files.length; i++) {
					this.uploadFile(files[i]);
				}

			},
			uploadFile(file){
				const containerName = `gptfiles`;
				const sasToken = "sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-05-29T15:09:48Z&st=2023-05-29T07:09:48Z&spr=https,http&sig=Mxa5vzLwIJ0tFojo8jZ3rSkNgNud3EwP2NmN9yyICpQ%3D";
				const storageAccountName = "cggptsc";
				const uploadUrl = `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`;
				console.log(uploadUrl);
				const blobService = new BlobServiceClient(uploadUrl);
				const containerClient =
					blobService.getContainerClient(containerName);


				// create blobClient for container
				const blobClient = containerClient.getBlockBlobClient(file.name);

				// set mimetype as determined from browser with file upload control
				const options = { blobHTTPHeaders: { blobContentType: file.type } };

				// upload file
				blobClient.uploadData(file, options);
				const file_url = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${file.name}`;
        console.log(file_url)
        this.file_urls.push(file_url)
        //TODO
        //调用后端接口通知
				this.msglist.push({
					id: this.msglist[this.msglist.length - 1].id + 1,
					type: 3,
					content: file.name,
					me: true
				})
      },
			getUseCount(){
				let username = localStorage.getItem("username")
				if (username){
					CountInfo(username).then(res => {
						console.log(res)
						if (res.code == 200){
							this.all_count = res.data.total_num
              this.use_count = res.data.count_used
						}else{
							this.toast.info(res.Msg);
							if(res.Msg == "User not logged in"){
								this.router.push("/login")
							}
						}
					})
				}else{
					this.toast.info("Please Login first");
					this.router.push("/login")
				}
      },
			send() {
				if (this.text) {
					// if (this.use_count >= this.all_count){
					// 	this.toast.info("配额不足")
          //   return
          // }
					this.msglist.push({
						id: this.msglist[this.msglist.length - 1].id + 1,
						type: 1,
						content: this.text,
						me: true
					})

					this.getResponse(this.text)

					this.text = ''

				}else{
					this.toast.info("Please input your question.");
        }
			},
			getResponse(text) {
				let username = localStorage.getItem("username")
        if (username){
					getChatResponse(text, username).then(res => {
						console.log(res)
						if (res.code == 200){
							this.msglist.push({
								id: this.msglist[this.msglist.length - 1].id + 1,
								type: 1,
								content: res.data.content,
								me: false
							})
              this.use_count = this.use_count + 1
            // }else{
						// 	this.toast.info(res.Msg);
						// 	if(res.Msg == "User not logged in"){
						// 		this.router.push("/login")
            //   }
            }
					})
        // }else{
				// 	this.toast.info("Please Login first");
        //   this.router.push("/login")
        }
			}
		}
	}
</script>

<style scoped lang="scss">
  .container {
    ul {
      padding: 0;
      margin: 0;
    }
    li {
      list-style: none;
    }
    .list {
      width: 100%;
      height: 100%;
      margin-bottom: 125px;
      margin-top: 60px;
      position: relative;
    }
    .top{
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      padding: 10px 0 6px;
      font-size: 14px;
      border-bottom: 1px solid #f5f5f7;
      background: #fff;
      z-index: 9999;
    }
    .bottom {
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      .comment{
        font-size: 12px;
        color: #929292;
        background-color: #fff;
        border-top: 1px solid #eee;
        padding: 10px 0 10px;
      }
      .line {
        width: 100%;
        height: 1px;
        background-color: #ddd;
      }
      .input-send {
        display: flex;
        justify-content: space-between;
        padding: 12px;
        background: #F2F4F6;
        img{
          width: 38px;
          height: 38px;
        }
        .input {
          padding-right: 10px;
          width: 100%;
          height: 40px;
          margin-left: 10px;
          border: 1px solid #88CB7F;
          border-radius: 8px;
          padding-left: 10px;
        }
        .send, .cannotsend {
          min-width: 80px;
          height: 32px;
          border-radius: 2px;
          width: 80px;
        }
        .send{
          background-color: #0795ff;
          border: 1px solid #0795ff;
          color: #fff;
        }
        .cannotsend{
          background-color: rgb(243, 242, 241);
          border: 1px solid rgb(243, 242, 241);
          color: rgb(210, 208, 206);
        }
      }
    }
  }
</style>
