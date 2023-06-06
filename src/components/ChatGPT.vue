<template>
  <div class="container">
    <div class="top">
      <img src="https://cggptsc.blob.core.windows.net/frontend-icon/icon-back.png"
           style="width: 20px;height: 20px;position: absolute;left: 20px;"
           @click="$router.go(-1)"/>
      Azure Open AI ChatGpt Demo
      <div style="text-align: right; color: #929292; padding-right: 14px;">
        配额：{{use_count}}/{{all_count}}
      </div>
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
        <div v-if="$route.query.robot_type == 'DataIntegrate'">
          <input type="file" id="company_file" name="company_file" accept=".pdf" multiple @change="changeFile"
                 style="display: none">
          <img class="uplod-file" style="margin-right: 10px;"
                  src="https://cggptsc.blob.core.windows.net/frontend-icon/icon-upload.png"
                @click="uploadFileTrigger"/>
        </div>
        <div class="input-container" v-if="this.input_type == 'text'">
<!--          <input v-model="text" placeholder="输入您的问题..." class="input" @keyup.enter="send"/>-->
          <textarea v-model="text" placeholder="输入您的问题..." class="input"/>
          <img src="https://cggptsc.blob.core.windows.net/frontend-icon/icon-mic.png" @click="toAudio" class="mic">
        </div>
        <div class="audio-container" v-if="this.input_type == 'audio'">
          <img src="https://cggptsc.blob.core.windows.net/frontend-icon/icon-circlemic.png" @click="sttFromMic" class="circle-mic">
          <img src="https://cggptsc.blob.core.windows.net/frontend-icon/icon-keyboard.png" @click="toText" class="keyboard">
        </div>

        <button plain type="info" :class="text ? 'send' : 'cannotsend'" @click="send" v-if="this.input_type == 'text'">
          发送
        </button>

      </div>
      <div class="comment">
        Copyright @ Cloud 团队，仅供内部试用
        <div>
          申请更多配额请联系：shuzhen.yu@foxmail.com
        </div>
      </div>

    </div>

  </div>
</template>

<script>
	import {getChatResponse} from "@/api/ApiChat";
	import {getChatResponseV2} from "@/api/ApiChatV2";
	import {getRobotGreeting} from "@/api/RobotGreeting";
	import {CountInfo} from "@/api/CountInfo";
	import {FileUpload} from "@/api/FileUpload"
	import LeftItem from "@/components/LeftItem";
	import RightItem from "@/components/RightItem";
	import { useToast } from "vue-toastification";
	import { useRouter } from "vue-router";
	import { BlobServiceClient } from "@azure/storage-blob";
	import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
	import { getTokenOrRefresh } from '../SpeechToken';

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
        input_type: "text",
				msglist: []
			}
		},
		beforeCreate() {
			document.querySelector('body').setAttribute('style', 'background-color:#F2F4F6')
		},
		beforeUnmount() {
			document.body.removeAttribute('style')
		},
    mounted(){
			this.getUseCount()
			this.changeFirstWord()
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
			changeFirstWord(){
				if (Object.hasOwnProperty.call(this.$router.currentRoute.value.query,'robot_type') === true){
          getRobotGreeting(this.$router.currentRoute.value.query.robot_type).then(res => {
            console.log(res)
            if (res.code == 200){
							this.msglist.push({
								id: 1,
								type: 1,
								content: res.greeting,
								me: false
							})
            }else{
              this.toast.info(res.message);
              if(res.message == "user not login"){
                this.router.push("/login")
              }
            }
          })
        }else{
          this.msglist.push({
            id: 1,
            type: 1,
            content: "你好，我是通用GPT AI助理，可以根据我自己的知识回答您一些通用的问题；尝试如下的问题：\n" +
              "请写一首春天的诗；\n猫熊和熊猫是一种动物吗？\n",
            me: false
          })
        }
				// if (Object.hasOwnProperty.call(this.$router.currentRoute.value.query,'robot_type') === true){
				// 	if (this.$router.currentRoute.value.query.robot_type == "AI"){
				// 		this.msglist.push({
				// 			id: 1,
				// 			type: 1,
				// 			content: "你好，我是通用GPT AI助理，可以根据我自己的知识回答您一些通用的问题；尝试如下的问题：\n" +
				// 				"请写一首春天的诗；\n猫熊和熊猫是一种动物吗？\n",
				// 			me: false
				// 		})
        //   }else if (this.$router.currentRoute.value.query.robot_type == "DataIntegrate") {
				// 		this.msglist.push({
				// 			id: 1,
				// 			type: 1,
				// 			content: "你好，我是知识库AI助理。请您先点击左下角文件按钮上传一个文件，我将尽力回答您关于该文件的问题。\n" +
				// 				"此外我内置了特斯拉Model X的说明书，您可以尝试问以下问题：\n" +
				// 				"Model X的续航里程是多少？\n" +
				// 				"Model X有哪些驾驶模式可供选择？",
				// 			me: false
				// 		})
				// 	}else if (this.$router.currentRoute.value.query.robot_type == "DataAnalysis") {
				// 		this.msglist.push({
				// 			id: 1,
				// 			type: 1,
				// 			content: "您好，我是一位数据分析AI助理。我能够查询后台数据库中的数据并进行一些数据分析。需要注意的是，这个功能是根据特定的数据进行定制的。具体而言，我会将您输入的文本转换成SQL语句，然后查询数据库，将数据传递给AI模型，以对销售数据进行预测。您可以尝试问我以下问题：\n"+
        //                 "2018年6月咖啡机的销量是多少？\n" +
        //                 "请你预测一下2023年一年的咖啡机销量数据。",
				// 			me: false
				// 		})
				// 	}
				// }else{
				// 	this.msglist.push({
				// 		id: 1,
				// 		type: 1,
				// 		content: "你好，我是通用GPT AI助理，可以根据我自己的知识回答您一些通用的问题；尝试如下的问题：\n" +
				// 			"请写一首春天的诗；\n猫熊和熊猫是一种动物吗？\n",
				// 		me: false
				// 	})
				// }
      },
			async sttFromMic() {
				this.toast("正在开启麦克风", { id: "translating", timeout: false });

				const speechsdk = require('microsoft-cognitiveservices-speech-sdk')
				const tokenObj = await getTokenOrRefresh();
				const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
				const constraints = { audio: true };
        navigator.mediaDevices.getUserMedia(constraints).then(
          stream => {
						this.toast("请说话", { id: "translating", timeout: false });
						var autoDetectSourceLanguageConfig = speechsdk.AutoDetectSourceLanguageConfig.fromLanguages(["en-US", "zh-CN"]);
						var audioConfig = speechsdk.AudioConfig.fromStreamInput(stream);
						var recognizer = speechsdk.SpeechRecognizer.FromConfig(speechConfig, autoDetectSourceLanguageConfig, audioConfig);
						recognizer.recognizeOnceAsync(result => {
								var languageDetectionResult = speechsdk.AutoDetectSourceLanguageResult.fromResult(result);
								var detectedLanguage = languageDetectionResult.language;
								console.log(`detectedLanguage========${detectedLanguage}`)

								recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
                let displayText = ""
                if (result.reason === ResultReason.RecognizedSpeech) {
                  displayText = `${result.text}`
                  this.toast.update("translating", { content: "识别成功", options: { timeout: 1000 } });
                  console.log(displayText)
                  this.text = displayText
                  this.send()
                } else {
                  this.toast.update("translating", { content: "识别失败, 请再说一遍", options: { timeout: 1000 } });
                  displayText = 'ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.';
                }
                recognizer.close()

							},
							{});
            console.log("授权成功！");
          },
          () => {
            console.error("授权失败！");
          }
        );
			},
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
      toAudio(){
				this.input_type = 'audio'
      },
			toText(){
				this.input_type = 'text'
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

        this.toast("正在上传。。。", { id: "uploading", timeout: false });
				var query_params = this.$router.currentRoute.value.query
				FileUpload(this.file_urls, query_params.conversation_id).then(res => {
					if (res.code == 200){
						this.toast.update("uploading", { content: "上传成功", options: { timeout: 1000 } });
						this.msglist.push({
							id: this.msglist[this.msglist.length - 1].id + 1,
							type: 3,
							content: file.name,
							me: true
						})
					}else{
						this.toast.update("uploading", { content: `上传失败：${res.message}`, options: { timeout: 1000 } });
					}
				})
      },
			getUseCount(){
				let username = localStorage.getItem("username")
				if (username){
					CountInfo(username).then(res => {
						console.log(res)
						if (res.code == 200){
							this.all_count = res.total_num
              this.use_count = res.count_used
						}else{
							this.toast.info(res.message);
							if(res.message == "User not logged in"){
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
					if (this.use_count >= this.all_count){
						this.toast.info("配额不足")
            return
          }
					this.msglist.push({
						id: this.msglist[this.msglist.length - 1].id + 1,
						type: 1,
						content: this.text,
						me: true
					})

          if (Object.hasOwnProperty.call(this.$router.currentRoute.value.query,'robot_type') === true){
						this.getResponse(this.text)
						if (this.$router.currentRoute.value.query.robot_type == "DataAnalysis") {
							this.toast("正在预测，请稍候。。。", { id: "predicting", timeout: false });
						}
          }else{
						this.getResponseV2(this.text)
          }

					this.text = ''

				}else{
					this.toast.info("Please input your question.");
        }
			},
      getResponseV2(text){
				let username = localStorage.getItem("username")
				if (username){
          let query_params = this.$router.currentRoute.value.query
          getChatResponseV2(text, query_params.conversation_id).then(res => {
            console.log(res)
            if (res.code == 200){
              this.msglist.push({
                id: this.msglist[this.msglist.length - 1].id + 1,
                type: 1,
                content: res.content,
                me: false
              })
              this.use_count = this.use_count + 1
            }else{
                this.toast.info(res.message);
                if(res.message == "User not logged in"){
                  this.router.push("/login")
                }
            }
          })
				}else{
					this.toast.info("Please Login first");
					this.router.push("/login")
				}
      },
			getResponse(text) {
				let username = localStorage.getItem("username")
        if (username){
          let query_params = this.$router.currentRoute.value.query
            getChatResponse(text, query_params.conversation_id, query_params.robot_type).then(res => {
              console.log(res)
              if (res.code == 200){
								this.use_count = this.use_count + 1
								if (this.$router.currentRoute.value.query.robot_type == "DataAnalysis") {
									this.toast("预测成功", {id: "predicting", timeout: 1000});
									let content = res.content
									if (content.indexOf("png") != -1 && content.indexOf("https") != -1){
										let arr = content.split('https');
										this.msglist.push({
											id: this.msglist[this.msglist.length - 1].id + 1,
											type: 1,
											content: arr[0],
											me: false
										})
										this.msglist.push({
											id: this.msglist[this.msglist.length - 1].id + 1,
											type: 2,
											content: `https${arr[1]}`,
											me: false
										})
										return
									}
								}
								this.msglist.push({
									id: this.msglist[this.msglist.length - 1].id + 1,
									type: 1,
									content: res.content,
									me: false
								})
              }else{
								if (this.$router.currentRoute.value.query.robot_type == "DataAnalysis") {
									this.toast(res.message, { id: "predicting", timeout: 1000 });
								}else{
									this.toast.info(res.message);
                }

                if(res.message == "User not logged in"){
                  this.router.push("/login")
                }
              }
            })
        }else{
					this.toast.info("Please Login first");
          this.router.push("/login")
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
        min-height: 40px;
        position: relative;
        .circle-mic{
          position: absolute;
          left: calc((100vw - 50px)/2);
          width: 50px;
          height: 50px;
          top: -6px;
        }
        .keyboard{
          position: absolute;
          right: 10px;
          width: 30px;
          height: 30px;
          top: 18px;
        }
        img{
          width: 38px;
          height: 38px;
        }
        .input-container{
          position: relative;
          width: 100%;
          .input {
            width: 100%;
            height: 36px;
            border: 1px solid #51CF66;
            border-radius: 8px;
          }
          .input::placeholder{
            line-height: 36px;
          }
          .mic{
            position: absolute;
            right: -4px;
            display: block;
            top: 6px;
            width: 28px;
            height: 28px;
          }
        }

        .send, .cannotsend {
          min-width: 70px;
          height: 36px;
          border-radius: 8px;
          width: 80px;
          margin-left: 12px;
        }
        .send{
          background-color: #51CF66;
          border: 1px solid #51CF66;
          color: #fff;
        }
        .cannotsend{
          background-color: #eee;
          border: 1px solid #eee;
          color: rgb(210, 208, 206);
        }
      }
    }
  }
</style>
