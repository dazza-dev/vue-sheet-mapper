<template>
    <div class="ctl" :class="{ 'ctl--disabled': disabled }">
        <div class="ctl__top">
            <label class="ctl__label">{{ label }}</label>
            <code v-if="prop" class="ctl__prop">{{ prop }}</code>
        </div>

        <div class="seg" role="group">
            <button
                v-for="opt in options"
                :key="String(opt.value)"
                type="button"
                class="seg__btn"
                :class="{ 'seg__btn--on': opt.value === modelValue }"
                :disabled="disabled"
                @click="emit('update:modelValue', opt.value)"
            >
                {{ opt.label }}
            </button>
        </div>

        <p v-if="$slots.hint" class="ctl__hint"><slot name="hint" /></p>
    </div>
</template>

<script setup lang="ts">
type Value = string | number | boolean;

defineProps<{
    label: string;
    /** Prop name shown next to the label, e.g. "auto-ignore". */
    prop?: string;
    modelValue: Value;
    options: { label: string; value: Value }[];
    disabled?: boolean;
}>();

const emit = defineEmits<{ 'update:modelValue': [value: Value] }>();
</script>
