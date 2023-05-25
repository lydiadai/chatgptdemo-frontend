<template>
  <div class="container">
    <div class="top">
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
      <div class="line"></div>
      <div class="input-send">
        <input v-model="text" placeholder="输入您的问题..." class="input" @keyup.enter="send"/>
        <button plain type="info" :class="text ? 'send' : 'cannotsend'" @click="send">发送</button>

      </div>
      <div class="comment">
        Copyright @ Cloud MS 团队，仅供内部试用
        <div>
          本站点前端由Open AI生成，人工校准。申请更多配额请联系：shuzhen.yu@capgemini.com
        </div>
      </div>

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

	export default {
		components: {LeftItem, RightItem},
		setup() {
			// Get toast interface
			const toast = useToast();
			const router = useRouter();
			// Make it available inside methods
			return { toast, router }
		},
		data: () => {
			return {
				text: '',
        all_count: 0,
        use_count: 0,
				msglist: [{
					id: 1,
					type: 1,
					content: 'Hello, how may I assist you?',
					me: false
				}]
			}
		},
    mounted(){
			this.getUseCount()
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
        background-color: #fff;
        padding: 2px;
        .input {
          padding-right: 10px;
          width: 100%;
          border: none;
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
