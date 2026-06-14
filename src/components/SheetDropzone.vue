<template>
    <div class="vsm-dropzone">
        <slot :open="open" :is-dragging="isDragging" :file="file">
            <div
                class="vsm-dropzone__area"
                :class="{ 'vsm-dropzone__area--over': isDragging, 'vsm-dropzone__area--has-file': !!file }"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="onDrop"
            >
                <template v-if="!file">
                    <div class="vsm-dropzone__icon">
                        <component :is="resolvedIcons.upload" width="48" height="48" />
                    </div>
                    <p class="vsm-dropzone__title">{{ messages.dropzone.title }}</p>
                    <p class="vsm-dropzone__subtitle">{{ messages.dropzone.subtitle }}</p>
                    <button type="button" class="vsm-btn vsm-btn--primary" @click="open">
                        {{ messages.dropzone.button }}
                    </button>
                </template>

                <template v-else>
                    <div class="vsm-dropzone__icon vsm-dropzone__icon--success">
                        <component :is="resolvedIcons.file" width="48" height="48" />
                    </div>
                    <p class="vsm-dropzone__filename">{{ file.name }}</p>
                    <button type="button" class="vsm-btn vsm-btn--secondary" @click="$emit('reset')">
                        {{ messages.dropzone.changeFile }}
                    </button>
                </template>
            </div>
        </slot>

        <!-- Hidden file input -->
        <input
            ref="inputRef"
            type="file"
            :accept="accept"
            class="vsm-dropzone__input"
            @change="onInputChange"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Messages, Icons } from '../types';
import IconUpload from '../icons/IconUpload.vue';
import IconFile from '../icons/IconFile.vue';

const props = defineProps<{
    file: File | null;
    messages: Messages;
    accept?: string;
    icons?: Icons;
}>();

const emit = defineEmits<{
    'file-selected': [file: File];
    reset: [];
}>();

const resolvedIcons = computed(() => ({
    upload: props.icons?.upload ?? IconUpload,
    file: props.icons?.file ?? IconFile,
}));

const inputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

function open() {
    inputRef.value?.click();
}

function onInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const f = target.files?.[0];
    if (f) emit('file-selected', f);
    target.value = '';
}

function onDrop(e: DragEvent) {
    isDragging.value = false;
    const f = e.dataTransfer?.files?.[0];
    if (f) emit('file-selected', f);
}

defineExpose({ open });
</script>

<style scoped>
.vsm-dropzone__input {
    display: none;
}

.vsm-dropzone__area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 48px 24px;
    border: 2px dashed var(--vsm-border-color, #d1d5db);
    border-radius: var(--vsm-radius, 8px);
    background: var(--vsm-dropzone-bg, #f9fafb);
    text-align: center;
    transition: border-color 0.15s, background 0.15s;
    cursor: pointer;
}

.vsm-dropzone__area--over {
    border-color: var(--vsm-primary, #3b82f6);
    background: var(--vsm-dropzone-hover-bg, #eff6ff);
}

.vsm-dropzone__icon {
    color: var(--vsm-muted-color, #9ca3af);
}

.vsm-dropzone__icon--success {
    color: var(--vsm-primary, #3b82f6);
}

.vsm-dropzone__title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--vsm-text-color, #111827);
}

.vsm-dropzone__subtitle {
    margin: 0;
    font-size: 0.875rem;
    color: var(--vsm-muted-color, #6b7280);
}

.vsm-dropzone__filename {
    margin: 0;
    font-weight: 500;
    color: var(--vsm-text-color, #111827);
}
</style>
