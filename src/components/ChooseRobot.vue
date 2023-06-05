<template>
  <div class="main-container">
    <div class="top">
      请选择需要的机器人
    </div>
    <div class="robot-container">
      <div style="width: 100%; color: #404040; font-size: 26px;">
        ChatGPT Bot
      </div>
      <router-link :to="{name:'Chat',query:{robot_type:robot.aiType, conversation_id: this.conversation_id}}" class="robot"
                   v-for="robot in robot_types" v-bind:key="robot.type">
        <img v-bind:src="robot.typeIcon" class="icon"/>
        <div class="text">{{ robot.name }}</div>
      </router-link>
    </div>

  </div>
</template>

<script>
	import {getAllRobot} from "@/api/AllRobot";
	import { useToast } from "vue-toastification";
	import { useRouter } from "vue-router";
	export default {
		setup() {
			// Get toast interface
			const toast = useToast();
			const router = useRouter();
			return { toast, router }
		},
		data() {
			return {
				conversation_id: this.guid(),
				robot_types: [
					// {
					// 	"typeIcon": "https://cggptsc.blob.core.windows.net/frontend-icon/icon_help.png",
					// 	"name": "通用AI助理",
					// 	"aiType": "AI"
					// },
					// {
					// 	"typeIcon": "https://cggptsc.blob.core.windows.net/frontend-icon/icon-analyze.png",
					// 	"name": "企业数据集成",
					// 	"aiType": "DataIntegrate"
					// },
					// {
					// 	"typeIcon": "https://cggptsc.blob.core.windows.net/frontend-icon/icon-ppt.png",
					// 	"name": "数据分析",
					// 	"aiType": "DataAnalysis"
					// }
				]
			}
		},
		mounted(){
			this.getRobotTypes()
		},
		methods: {
			S4() {
				return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			},
			guid() {
				return (this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4());
			},
      getRobotTypes(){
        getAllRobot().then(res => {
          console.log(res)
          if (res.code == 200){
            this.robot_types = res.data
          }else{
            this.toast.info(res.message);
						if(res.message == "user not login"){
							this.router.push("/login")
						}
          }
        })
      }
		}
	}
</script>

<style scoped>
  .top{
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    padding: 10px 0 10px;
    font-size: 14px;
    border-bottom: 1px solid #f5f5f7;
    background: #fff;
    z-index: 9999;
  }
  .robot-container{
    margin-top: 100px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .robot{
    width: 240px;
    height: 60px;
    line-height: 60px;
    margin-top: 30px;
    display: flex;
    border: 1px solid #d4d4d4;
    border-radius: 8px;
    color: #404040;
    text-decoration: none;
    margin-right: 40px;
  }
  .icon{
    width: 22px;
    height: 22px;
    margin-top: 18px;
    margin-right: 14px;
    margin-left: 10px;
  }
  .text{
    font-size: 16px;
  }
  @media (max-width: 767px){
    .robot{
      margin-right: 0;
    }
  }
</style>
