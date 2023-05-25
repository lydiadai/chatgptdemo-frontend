<template>
  <div class="login">
    <div class="top">
      Azure Open AI ChatGpt Demo
    </div>
    <div class="login-container">
      <div class="title">登录</div>
      <form>
        <div class="input-container">
          <label for="username">账号</label>
          <input type="text" id="username" v-model="username">
        </div>
        <div class="input-container">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="password">
        </div>
        <div style="display: flex;width: 100%;">
          <button @click.prevent="login">登录</button>
        </div>

      </form>
      <router-link to="/register" class="register">注册</router-link>
    </div>

    <div class="bottom">
      Copyright @ Cloud MS 团队，仅供内部试用
    </div>
  </div>

</template>

<script>
	import {Login} from "@/api/Login";
	import { useToast } from "vue-toastification";
	import { useRouter } from "vue-router";

	export default {
		setup() {
			// Get toast interface
			const toast = useToast();
			const router = useRouter();
			// Make it available inside methods
			return { toast, router }
		},
		data() {
			return {
				username: '',
				password: '',
			}
		},

		methods: {
			login() {
        if (this.username && this.password){
          console.log(this.username)
          console.log(this.password)
          Login(this.username, this.password).then(res => {
            console.log(res)
            if (res.code && res.code == 200){
                localStorage.setItem("username", this.username)
                this.router.push("/chat")
            }else{
							this.toast.info(res.Msg);
            }
          })
        }else{
					this.toast.info("Please input username and password");
        }
			}
		},
	}
</script>

<style scoped>
  .login-container {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 444px;
    height: 550px;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    box-shadow: 0 4px 8px rgb(31 35 41 / 3%), 0 3px 6px -6px rgb(31 35 41 / 5%), 0 6px 18px 6px rgb(31 35 41 / 3%);
    border-radius: 12px;
    padding-top: 40px;
    padding-right: 40px;
    padding-left: 40px;
  }
  .title{
    font-size: 22px;
    color: var(--text-title);
    font-weight: 600;
    line-height: 30px;
    white-space: pre-wrap;
    margin-bottom: 12px;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 90px;
    left: 0;
    right: 0;
    padding: 50px 78px;
  }

  label {
    margin-bottom: 1rem;
    margin-right: 1rem;
    display: block;
    width: 75px;
    text-align: right;
  }

  input {
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    width: 248px;
  }

  button {
    padding: 0.5rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
    text-decoration:none;
    font-size: 14px;
    border-radius: 999999px;
    width: 366px;
    height: 40px;
  }
  .register{
    position: absolute;
    bottom: 20px;
    right: 0;
    left: 0;
    color: #4040ff;
  }
  .input-container{
    width: 100%;
    display: flex;
    margin-bottom: 24px;
  }
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
  .bottom {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    font-size: 12px;
    color: #929292;
    background-color: #fff;
    border-top: 1px solid #eee;
    padding: 10px 0 10px;
  }
  @media (max-width: 767px){
    .login-container{
      box-shadow: none;
      position: relative;
      width: auto;
      height: auto;
      left: 0;
      top: 0;
      transform: none;
      padding: 0;
      margin-top: 100px;
    }
    form{
      position: relative;
      top: 0;
      padding: 34px;
    }
    .title{
      width: 100%;
    }
    input{
      width: calc(100%-85px);
    }
    button{
      width: 100%;
    }
    .register{
      position: relative;
      bottom: 0;
    }

  }
</style>
