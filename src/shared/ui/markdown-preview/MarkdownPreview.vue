<template>
    <div class="markdown-preview">
        <div v-if="shouldUseMarkdown && renderedMarkdown" v-html="renderedMarkdown"></div>
        <div v-else class="markdown-preview__plain">{{ sourceText }}</div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
    defineProps<{
        modelValue?: string | null
    }>(),
    {
        modelValue: '',
    },
)

type LinkOpenRule = (
    tokens: Array<{
        attrSet: (name: string, value: string) => void
    }>,
    idx: number,
    options: unknown,
    env: unknown,
    self: {
        renderToken: (tokens: unknown, idx: number, options: unknown) => string
    },
) => string

type MarkdownRenderer = {
    render: (source: string) => string
    renderer: {
        rules: {
            link_open?: LinkOpenRule
        }
    }
}

const sourceText = computed(() => props.modelValue || '')
const shouldUseMarkdown = computed(() => hasMarkdownSyntax(sourceText.value))
const renderedMarkdown = ref('')

let markdownPromise: Promise<MarkdownRenderer> | undefined
let renderVersion = 0

function hasMarkdownSyntax(source: string) {
    if (!source) return false

    return [
        /^#{1,6}\s+\S/m,
        /^\s{0,3}>\s+\S/m,
        /^\s{0,3}(?:[-*+]|\d+\.)\s+\S/m,
        /```|~~~|`[^`\n]+`/,
        /!\[[^\]]*]\([^)]+\)/,
        /\[[^\]]+]\([^)]+\)/,
        /(?:\*\*|__)\S[\s\S]*?\S(?:\*\*|__)/,
        /(?:^|[^\w])(?:\*|_)\S[^*_]*?\S(?:\*|_)(?!\w)/,
        /https?:\/\/\S+|www\.\S+/i,
    ].some((pattern) => pattern.test(source))
}

async function loadMarkdownRenderer() {
    if (!markdownPromise) {
        markdownPromise = import('markdown-it').then(({ default: MarkdownIt }) => {
            const markdown = new MarkdownIt({
                breaks: true,
                html: false,
                linkify: true,
            }) as MarkdownRenderer

            const defaultLinkRender =
                markdown.renderer.rules.link_open ||
                function (tokens, idx, options, env, self) {
                    return self.renderToken(tokens, idx, options)
                }

            markdown.renderer.rules.link_open = function (tokens, idx, options, env, self) {
                tokens[idx].attrSet('target', '_blank')
                tokens[idx].attrSet('rel', 'noopener noreferrer')

                return defaultLinkRender(tokens, idx, options, env, self)
            }

            return markdown
        })
    }

    return markdownPromise
}

watch(
    [sourceText, shouldUseMarkdown],
    async ([source, useMarkdown]) => {
        const currentVersion = ++renderVersion

        if (!useMarkdown) {
            renderedMarkdown.value = ''
            return
        }

        const markdown = await loadMarkdownRenderer()
        if (currentVersion === renderVersion) {
            renderedMarkdown.value = markdown.render(source)
        }
    },
    { immediate: true },
)
</script>

<style scoped lang="scss">
.markdown-preview {
    width: 100%;
    color: $su-grey-dark;
    font-size: 14px;
    line-height: 1.6;
    overflow-wrap: anywhere;

    &__plain {
        white-space: pre-wrap;
    }

    :deep(*) {
        box-sizing: border-box;
    }

    :deep(p) {
        margin: 0 0 0.65em;

        &:last-child {
            margin-bottom: 0;
        }
    }

    :deep(a) {
        color: $su-blue;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    :deep(ul),
    :deep(ol) {
        margin: 0 0 0.65em;
        padding-left: 1.5em;
    }

    :deep(blockquote) {
        margin: 0 0 0.75em;
        padding: 0.2em 0 0.2em 0.85em;
        border-left: 3px solid rgba(113, 182, 255, 0.45);
        color: #64748b;
    }

    :deep(code) {
        padding: 0.08em 0.32em;
        border-radius: 4px;
        background-color: rgba(15, 23, 42, 0.06);
        color: #334155;
        font-family: Consolas, Monaco, 'Courier New', monospace;
        font-size: 0.92em;
    }

    :deep(pre) {
        overflow-x: auto;
        margin: 0 0 0.75em;
        padding: 0.75em;
        border-radius: 8px;
        background-color: #f8fafc;

        code {
            padding: 0;
            background: transparent;
        }
    }
}
</style>
