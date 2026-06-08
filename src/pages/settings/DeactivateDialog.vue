<template>
    <div class="dialog">
        <el-dialog
            v-model="visible"
            :show-close="false"
            align-center
            width="420px"
            class="deactivate-dialog"
        >
            <div class="dialog-content">
                <div class="icon-container">
                    <el-icon :size="48" color="#ff4d4f"><WarningFilled /></el-icon>
                </div>
                <h2 class="title">注销账号</h2>
                <p class="description">
                    此操作不可逆！注销后您的个人信息将被清除，历史提问和回答将保留但显示为"已注销用户"。
                </p>
                <div class="field-group">
                    <el-input
                        v-model="password"
                        type="password"
                        placeholder="请输入当前密码以确认注销"
                        show-password
                        @keyup.enter="confirmDeactivate"
                    />
                </div>
                <div class="actions">
                    <el-button @click="visible = false" type="default">取消</el-button>
                    <el-button
                        @click="confirmDeactivate"
                        type="danger"
                        :loading="loading"
                        class="confirm-btn"
                    >
                        确认注销
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index.mjs'
import { ElDialog } from 'element-plus/es/components/dialog/index.mjs'
import 'element-plus/es/components/dialog/style/css'
import { WarningFilled } from '@element-plus/icons-vue'
import { deactivateAccountApi } from '@/entities/user'
import { UserStore } from '@/entities/user'
import { useRouter } from 'vue-router'

const visible = defineModel('visible', { type: Boolean, default: false })
const password = ref('')
const loading = ref(false)

const userStore = UserStore()
const router = useRouter()

async function confirmDeactivate() {
    if (!password.value) {
        ElMessage.warning('请输入密码')
        return
    }
    loading.value = true
    try {
        const res = await deactivateAccountApi(password.value)
        if (res) {
            ElMessage.success('账号已注销')
            userStore.resetState()
            router.push({ name: 'Login' })
        } else {
            ElMessage.error('注销失败')
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : '注销失败，请检查密码是否正确'
        ElMessage.error(message)
    } finally {
        loading.value = false
        password.value = ''
    }
}
</script>

<style scoped lang="scss">
.dialog {
    .dialog-content {
        text-align: center;
        padding: 1rem 0;

        .icon-container {
            margin-bottom: 1rem;
        }

        .title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
            color: #ff4d4f;
        }

        .description {
            color: #909399;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
            line-height: 1.5;
            text-align: left;
            padding: 0 1rem;
        }

        .field-group {
            margin-bottom: 1.5rem;
            padding: 0 1rem;
        }

        .actions {
            display: flex;
            justify-content: center;
            gap: 1rem;

            .el-button {
                min-width: 100px;
                height: 40px;
                border-radius: 8px;
                font-weight: 500;
                transition: all 0.3s ease;

                &:hover {
                    transform: translateY(-2px);
                }
            }

            .confirm-btn {
                background-color: #ff4d4f;
                border-color: #ff4d4f;
            }
        }
    }
}

:deep(.el-dialog) {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

:deep(.el-dialog__header) {
    padding: 0;
}

:deep(.el-dialog__body) {
    padding: 25px 30px;
}
</style>
