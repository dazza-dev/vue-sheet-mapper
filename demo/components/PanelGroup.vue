<template>
    <section class="pg" :class="{ 'pg--open': open }">
        <button class="pg__head" type="button" @click="open = !open">
            <svg class="pg__chevron" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="pg__title">{{ title }}</span>
            <span v-if="badge" class="pg__badge">{{ badge }}</span>
        </button>
        <div v-show="open" class="pg__body">
            <slot />
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
    defineProps<{
        title: string;
        /** Small counter shown when the group has non-default options active. */
        badge?: number;
        defaultOpen?: boolean;
    }>(),
    { defaultOpen: true },
);

const open = ref(props.defaultOpen);
</script>

<style>
.pg + .pg {
    margin-top: 1px;
}

.pg__head {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 16px;
    /* Its own band, to separate the groups. */
    background: var(--d-group-head, transparent);
    border: 0;
    border-top: 1px solid var(--d-line);
    border-bottom: 1px solid var(--d-line);
    cursor: pointer;
    font: inherit;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--d-text);
    text-align: left;
}

.pg__head:hover {
    background: var(--d-group-head-hover, var(--d-hover));
}

.pg__chevron {
    flex-shrink: 0;
    transition: transform 0.18s ease;
    color: var(--d-text-dim);
}

.pg--open .pg__chevron {
    transform: rotate(90deg);
}

.pg__title {
    flex: 1;
}

.pg__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 17px;
    height: 17px;
    padding: 0 5px;
    border-radius: 9px;
    background: var(--d-accent);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0;
}

.pg__body {
    padding: 14px 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
