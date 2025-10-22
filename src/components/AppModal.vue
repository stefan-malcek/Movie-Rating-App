<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/solid";

const { title } = defineProps({ title: { type: String, default: null } });
const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>

<template>
  <div
    class="absolute inset-0 backdrop-blur bg-gray-800/40 z-10 flex items-center justify-center"
  >
    <div
      class="w-full max-w-2xl flex flex-col shadow-2xl bg-gray-800 text-white rounded-md overflow-hidden"
    >
      <div
        class="w-full flex justify-between items-center bg-gray-900 px-4 py-2"
      >
        <span class="text-xl">{{ title }}</span>
        <button @click="close">
          <XMarkIcon class="size-4" />
        </button>
      </div>
      <div class="p-4">
        <slot />
      </div>
    </div>
  </div>
</template>
