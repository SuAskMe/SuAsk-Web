<template>
  <div class="password-reset">
    <h1>密码</h1>
    <div class="form-group">
      <label for="newPassword">重置密码</label>
      <input
        id="newPassword"
        type="password"
        v-model="newPassword"
        placeholder="请输入内容"
      />
    </div>
    <div class="form-group">
      <label for="confirmPassword">再次输入密码</label>
      <input
        id="confirmPassword"
        type="password"
        v-model="confirmPassword"
        placeholder="请输入内容"
      />
    </div>
    <button class="reset-button" @click="resetPassword">重置</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newPassword: "",
      confirmPassword: "",
    };
  },
  methods: {
    resetPassword() {
      if (this.newPassword === this.confirmPassword) {
        alert("密码重置成功！");
      } else {
        alert("两次输入的密码不一致，请重新输入！");
      }
    },
  },
};
</script>

<style scoped>
.password-reset {
  max-width: 400px;
  margin: 20px auto;
  font-family: Arial, sans-serif;
}
h3 {
  font-size: 20px;
  margin-bottom: 10px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
}
input {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.reset-button {
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
}
.reset-button:hover {
  background-color: #e33e3f;
}
</style>
