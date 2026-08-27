<template>
    <pre :class="['code', { 'code--compact': compact }]"><code class="hljs" v-html="highlighted" /></pre>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);

const props = withDefaults(
    defineProps<{
        code: string;
        /** 'xml' for Vue template markup, 'typescript' for everything else. */
        lang?: 'typescript' | 'xml';
        /** Tighter type scale, for the narrow sidebar column. */
        compact?: boolean;
    }>(),
    { lang: 'typescript', compact: false },
);

const highlighted = computed(() => hljs.highlight(props.code, { language: props.lang }).value);
</script>

<style>
.code {
    margin: 0;
    background: var(--d-code-bg);
    padding: 16px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    line-height: 1.65;
    overflow-x: auto;
    white-space: pre;
    tab-size: 4;
}

.code--compact {
    padding: 11px 12px;
    font-size: 10px;
    line-height: 1.65;
    border-radius: 8px;
    white-space: pre-wrap;
    overflow-wrap: break-word;
}

/* Token colours, matched to the demo palette. */
.hljs { color: #cdd6f4; }
.hljs-comment, .hljs-quote { color: #6b7280; font-style: italic; }
.hljs-keyword, .hljs-literal, .hljs-type { color: #c792ea; }
.hljs-string, .hljs-meta .hljs-string { color: #42b883; }
.hljs-number { color: #f78c6c; }
.hljs-title, .hljs-title.function_ { color: #82aaff; }
.hljs-attr, .hljs-property { color: #ffcb6b; }
.hljs-variable, .hljs-params { color: #cdd6f4; }
.hljs-built_in, .hljs-class .hljs-title { color: #7fdbca; }
.hljs-tag { color: #6b7280; }
.hljs-name { color: #ff9cac; }
.hljs-attribute { color: #ffcb6b; }
.hljs-punctuation { color: #89ddff; }
</style>
