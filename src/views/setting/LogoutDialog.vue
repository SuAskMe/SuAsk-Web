<template>
    <div class="dialog">
        <el-dialog
            v-model="visible"
            :show-close="false"
            align-center
            width="400px"
            class="logout-dialog"
        >
            <div class="dialog-content">
                <div class="icon-container">
                    <i class="el-icon-warning-outline"></i>
                </div>
                <h2 class="title">确定要退出登录吗?</h2>
                <p class="description">退出后需要重新登录才能访问您的账号</p>
                <div class="actions">
                    <el-button @click="visible = false" type="default">取消</el-button>
                    <el-button @click="logout" type="primary" class="confirm-btn"
                        >确定退出</el-button
                    >
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ControlPanelStore } from '@/store/modules/control-panel'
import { UserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const visible = defineModel('visible', { type: Boolean, default: true })

const userStore = UserStore()
const sidebarStore = ControlPanelStore()

const router = useRouter()

async function logout() {
    try {
        const res = await userStore.logout()
        sidebarStore.clearSelectedItem()

        // console.log(res);
        if (res) {
            ElMessage.success('退出登录成功')
            // console.log(res);
            router.push({ name: 'Login' })
        } else {
            ElMessage.error('退出登录失败')
        }
    } catch (e) {
        ElMessage.error((e as unknown as Error).message)
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

            i {
                font-size: 3rem;
                color: #ff9800;
            }
        }

        .title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
            color: #333;
        }

        .description {
            color: #909399;
            margin-bottom: 1.5rem;
            font-size: 0.95rem;
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
