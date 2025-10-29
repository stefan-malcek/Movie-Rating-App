<script setup lang="ts">
import { onMounted, reactive, useTemplateRef } from "vue";

const { modelValue } = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: () => ({
      id: null,
      name: null,
      description: null,
      image: null,
      genres: [],
      inTheaters: false,
    }),
  },
});

const form = reactive({
  id: modelValue?.id,
  name: modelValue?.name,
  description: modelValue?.description,
  image: modelValue?.image,
  genres: modelValue?.genres || [],
  inTheaters: modelValue?.inTheaters || false,
});
const genres = reactive([
  { text: "Drama", value: "Drama" },
  { text: "Crime", value: "Crime" },
  { text: "Action", value: "Action" },
  { text: "Comedy", value: "Comedy" },
]);
const errors = reactive({
  name: null,
  image: null,
});

const emit = defineEmits(["cancel", "update:modelValue"]);

const input = useTemplateRef("nameInput");

onMounted(() => {
  input.value?.focus();
});

const updateModel = () => {
  if (!validate(form)) {
    return;
  }

  const data = {
    id: form.id || Number(Date.now()),
    name: form.name,
    description: form.description,
    image: form.image,
    genres: form.genres,
    inTheaters: form.inTheaters,
  };

  resetForm();
  emit("update:modelValue", data);
};

const validate = (input) => {
  clearErrors();
  let success = true;

  if (!input.name) {
    errors.name = "Name is required";
    success = false;
  }

  if (!input.image) {
    errors.image = "Image is required";
    success = false;
  }

  return success;
};

const cancel = () => {
  resetForm();
  emit("cancel");
};

const resetForm = () => {
  form.id = null;
  form.name = null;
  form.description = null;
  form.image = null;
  form.genres = [];
  form.inTheaters = false;

  clearErrors();
};

const clearErrors = () => {
  errors.name = null;
  errors.image = null;
};
</script>

<template>
  <form
    @submit.prevent="updateModel"
    class="shrink-0 w-full flex flex-col space-y-5"
  >
    <div class="form-element">
      <label for="name">Name</label>
      <input
        id="name"
        type="text"
        v-model="form.name"
        class="form-input"
        ref="nameInput"
      />
      <span v-if="errors.name" class="text-red-500">{{ errors.name }}</span>
    </div>
    <div class="form-element">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="form.description"
        class="form-input"
      />
    </div>
    <div class="form-element">
      <label for="image">Image</label>
      <input id="image" type="text" v-model="form.image" class="form-input" />
      <span v-if="errors.image" class="text-red-500">{{ errors.image }}</span>
    </div>
    <div class="form-element">
      <label for="genres">Genres</label>
      <select id="genres" multiple v-model="form.genres" class="form-input">
        <option v-for="genre in genres" :key="genre.value" :value="genre.value">
          {{ genre.text }}
        </option>
      </select>
    </div>
    <div class="form-element">
      <label class="flex items-center justify-start space-x-2">
        <input id="inTheaters" type="checkbox" v-model="form.inTheaters" />
        <span>In Theaters</span>
      </label>
    </div>
    <div class="flex items-center justify-between w-full">
      <button
        type="button"
        class="text-white bg-gray-500 rounded px-4 py-2"
        @click="cancel"
      >
        Cancel
      </button>
      <button type="submit" class="text-white bg-blue-400 rounded px-4 py-2">
        Save
      </button>
    </div>
  </form>
</template>

<style scoped>
.form-element {
  @apply flex flex-col items-start justify-start w-full;
}

.form-input {
  @apply w-full rounded-md bg-gray-900  border border-white/50 focus:border-blue-600 focus:outline-none px-2 py-1;
}
</style>
