<template>
    <section class="help-container">
        <header class="help-header">
            <QuestionHeader @sidebar="sidebar" sidebar_btn> </QuestionHeader>
            <div class="help-title">
                <p>帮助中心</p>
            </div>
        </header>
        <main class="help-main">
            <el-scrollbar>
                <div
                    class="help-content"
                    :class="{ 'announcement-content': activeTab === 'announcements' }"
                >
                    <div class="help-tabs-container">
                        <div class="help-tabs-wrapper" role="tablist" aria-label="帮助中心分类">
                            <button
                                v-for="tab in tabs"
                                :key="tab.key"
                                type="button"
                                class="help-tab-item"
                                :class="{ active: activeTab === tab.key }"
                                :aria-selected="activeTab === tab.key"
                                role="tab"
                                @click="changeTab(tab.key)"
                            >
                                {{ tab.label }}
                            </button>
                        </div>
                    </div>

                    <div v-if="activeTab === 'help'" class="help-tab-panel">
                        <el-card class="help-card intro-card" shadow="hover">
                            <h1>SuAsk • 速问</h1>
                            <el-image
                                src="https://suask.me/upload/cf/09/cf09243ca5e3a5461a8cca5947f5896247918a9a26bcfd6e5d6828634577c47f.png"
                            />
                            <p class="intro-text">
                                一个匿名提问箱，为了解决<del>苏老师</del>匿名提问箱经常跑路的问题
                            </p>
                        </el-card>

                        <el-card class="help-card feature-card" shadow="hover">
                            <template #header>
                                <div class="card-header">
                                    <h2>它可以实现什么</h2>
                                </div>
                            </template>
                            <el-image
                                src="https://suask.me/upload/b2/57/b25743db92fd95fbc332005c4172a1d96fab7627201782eb8f02bebd78d856a4.png"
                            />
                            <ul class="feature-list">
                                <li>
                                    <el-icon><Check /></el-icon>
                                    完全匿名，用户可以畅所欲言，后台不会对用户信息进行记录
                                </li>
                                <li>
                                    <el-icon><Check /></el-icon> 公开论坛，用户可以自由发表提问
                                </li>
                                <li>
                                    <el-icon><Check /></el-icon>
                                    教师匿名提问箱，用户可以匿名提问教师问题，内置学院教师信息，开箱即用
                                </li>
                                <li>
                                    <el-icon><Check /></el-icon>
                                    提醒功能，你不会错过任何一条有关信息
                                </li>
                            </ul>
                        </el-card>

                        <el-card class="help-card qa-card" shadow="hover">
                            <template #header>
                                <div class="card-header">
                                    <h2>Q&A</h2>
                                </div>
                            </template>
                            <div class="qa-item" v-for="(item, index) in qaItems" :key="index">
                                <h3>{{ item.question }}</h3>
                                <p v-html="item.answer"></p>
                            </div>
                        </el-card>
                    </div>

                    <div v-else class="help-tab-panel announcement-tab-panel">
                        <AnnouncementList
                            :can-load="canViewAnnouncements"
                            locked-message="公告仅限登录用户查看，请登录或升级账号后查看完整公告。"
                        />
                    </div>
                </div>
            </el-scrollbar>
        </main>
    </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QuestionHeader from '@/widgets/question-header'
import { SidebarStore } from '@/widgets/app-shell/model'
import AnnouncementList from '@/widgets/announcement-list'
import { ANNOUNCEMENT_HELP_TAB } from '@/entities/announcement'
import { UserStore } from '@/entities/user'
import { Check } from '@element-plus/icons-vue'
import { ElCard } from 'element-plus/es/components/card/index.mjs'
import { ElImage } from 'element-plus/es/components/image/index.mjs'
import 'element-plus/es/components/card/style/css'
import 'element-plus/es/components/image/style/css'

type HelpTabKey = 'help' | 'announcements'

const sidebarStore = SidebarStore()
const userStore = UserStore()
const route = useRoute()
const router = useRouter()
const sidebar = () => {
    sidebarStore.toggle()
}
const canViewAnnouncements = computed(() => userStore.isLoggedIn() && !userStore.isGuest())
const tabs: Array<{ key: HelpTabKey; label: string }> = [
    { key: 'help', label: '使用帮助' },
    { key: 'announcements', label: '公告列表' },
]

function resolveTab(tab: unknown): HelpTabKey {
    const tabValue = Array.isArray(tab) ? tab[0] : tab
    return tabValue === ANNOUNCEMENT_HELP_TAB ? 'announcements' : 'help'
}

const activeTab = ref<HelpTabKey>(resolveTab(route.query.tab))

watch(
    () => route.query.tab,
    (tab) => {
        activeTab.value = resolveTab(tab)
    },
)

function changeTab(tab: HelpTabKey) {
    activeTab.value = tab
    const query = { ...route.query }
    if (tab === 'announcements') {
        query.tab = ANNOUNCEMENT_HELP_TAB
    } else {
        delete query.tab
    }
    router.replace({ path: '/help', query })
}

defineOptions({
    name: 'HelpPage',
})

const qaItems = ref([
    {
        question: 'Q: 为什么要创建这个项目？',
        answer: 'A: 学院的苏老师深受商用匿名提问箱跑路的迫害，<del>据他所说已经用跑路了3个</del>，便希望我们开发一个属于学院的匿名提问箱',
    },
    {
        question: 'Q: 为什么使用go-frame？',
        answer: 'A: 这个项目本质上还是本专业的中级实训大作业，当时指明要求使用go语言来编写后端，而go-frame是一个较成熟的框架，便采用了',
    },
    {
        question: 'Q: 我发现了bug怎么办？',
        answer: 'A: 欢迎提交<a href="https://github.com/DreamingLri/SuAsk/issues/new" class="qa-link">Issue</a>',
    },
])
</script>

<style scoped lang="scss" src="./help.scss"></style>
