<template>
  <div class="profile-edit">
    <h1>基础信息</h1>
    <div class="profile-container">
      <div class="profile-avatar">
        <div class="avatar-circle">
          <i class="user-icon"></i>
        </div>
        <p class="username">@DreamingLri</p>
      </div>
      <div class="profile-form">
        <div class="form-group">
          <label for="nickname">昵称</label>
          <input
            id="nickname"
            type="text"
            v-model="nickname"
            placeholder="请输入昵称"
          />
        </div>
        <div class="form-group">
          <label for="bio">简介</label>
          <textarea
            id="bio"
            v-model="bio"
            placeholder="请输入内容"
          ></textarea>
        </div>
        <button class="save-button" @click="saveProfile">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nickname: "DreamingLri",
      bio: "",
    };
  },
  methods: {
    saveProfile() {
      alert(`昵称: ${this.nickname}\n简介: ${this.bio}`);
    },
  },
};
</script>

<style scoped>
.profile-edit {
  max-width: 600px;
  margin: 20px auto;
  font-family: Arial, sans-serif;
}
h3 {
  font-size: 22px;
  margin-bottom: 20px;
  font-weight: bold;
}
.profile-container {
  display: flex;
  align-items: center;
}
.profile-avatar {
  text-align: center;
  margin-right: 20px;
}
.avatar-circle {
  width: 100px;
  height: 100px;
  background-color: #4285f4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-icon {
  width: 50px;
  height: 50px;
  background-color: #fff;
  mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A10.97 10.97 0 0112 15c2.386 0 4.612.835 6.379 2.23M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>') no-repeat;
  mask-size: cover;
}
.username {
  margin-top: 10px;
  font-size: 16px;
  color: #666;
}
.profile-form {
  flex: 1;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
}
input,
textarea {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
textarea {
  resize: none;
  height: 80px;
}
.save-button {
  background-color: #4285f4;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
}
.save-button:hover {
  background-color: #3367d6;
}
</style>
