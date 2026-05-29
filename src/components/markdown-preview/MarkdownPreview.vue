<template>
    <div class="markdown-preview" v-html="renderedMarkdown"></div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
        modelValue?: string | null
    }>(),
    {
        modelValue: '',
    },
)

const markdown = new MarkdownIt({
    breaks: true,
    html: false,
    linkify: true,
})

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

const renderedMarkdown = computed(() => markdown.render(props.modelValue || ''))
</script>

<style scoped lang="scss">
.markdown-preview {
    width: 100%;
    color: $su-grey-dark;
    font-size: 14px;
    line-height: 1.6;
    overflow-wrap: anywhere;

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
