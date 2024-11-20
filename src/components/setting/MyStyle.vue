<template>
    <h1>主题</h1>
    <hr>
</template>

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