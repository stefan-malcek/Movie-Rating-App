<script setup>
import { items } from "./movies.json";
import { computed, reactive, ref, watch } from "vue";
import { StarIcon, PencilIcon, TrashIcon } from "@heroicons/vue/24/solid";

const cloneMovies = (data) => JSON.parse(JSON.stringify(data));
const movies = reactive([...cloneMovies(items)]);

const averageRating = computed(() => {
  const ratings = movies.map((movie) => movie.rating);
  return (
    Math.round(
      (ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length) * 10,
    ) / 10
  );
});

const totalMovies = computed(() => {
  return movies.length;
});

const normalizeRating = (value, min = 0, max = 5) => {
  let n = parseInt(value, 10);
  if (Number.isNaN(n)) {
    n = 0;
  }
  if (n < min) {
    return min;
  }
  if (n > max) {
    return max;
  }
  return n;
};

const availableGenres = reactive(["Action", "Comedy", "Drama", "Sci-Fi"]);
const form = reactive({
  name: null,
  description: null,
  image: null,
  genres: [],
  inTheaters: false,
});

const errors = reactive({
  name: null,
  image: null,
});

watch(
  form,
  () => {
    console.log(form);
  },
  { deep: true },
);

const setMovieRating = (movie, rating) => {
  movie.rating = normalizeRating(rating);
};

const showMovieForm = ref(false);

const showForm = () => {
  showMovieForm.value = true;
};

const hideForm = () => {
  showMovieForm.value = false;
  resetForm();
};

const removeRatings = () => {
  movies.forEach((movie) => {
    movie.rating = null;
  });
};

const addMovie = () => {
  if (!validate(form)) {
    return;
  }

  movies.push({ ...form });
  resetForm();
  hideForm();
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

const resetForm = () => {
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
  <div class="max-w-full h-screen flex-col items-center justify-center mx-auto">
    <div
      v-if="showMovieForm"
      class="absolute inset-0 backdrop-blur bg-gray-800/40 z-10 flex items-center justify-center"
    >
      <form
        @submit.prevent="addMovie"
        class="shrink-0 w-full max-w-2xl rounded-md flex flex-col shadow-2xl bg-gray-800 p-4 space-y-5 text-white"
      >
        <div class="form-element">
          <label for="name">Name</label>
          <input id="name" type="text" v-model="form.name" class="form-input" />
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
          <input
            id="image"
            type="text"
            v-model="form.image"
            class="form-input"
          />
          <span v-if="errors.image" class="text-red-500">{{
            errors.image
          }}</span>
        </div>
        <div class="form-element">
          <label for="genres">Genres</label>
          <select id="genres" multiple v-model="form.genres" class="form-input">
            <option
              v-for="genre in availableGenres"
              :key="genre"
              :value="genre"
            >
              {{ genre }}
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
            @click="hideForm"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="text-white bg-blue-400 rounded px-4 py-2"
          >
            Create
          </button>
        </div>
      </form>
    </div>
    <div class="w-full flex justify-around py-10">
      <p class="text-white">
        Total Movies: {{ totalMovies }} / Average Rating: {{ averageRating }}
      </p>
      <div class="flex gap-x-5">
        <button
          class="text-white bg-blue-500 rounded px-4 py-2"
          @click="removeRatings"
        >
          Remove Ratings
        </button>
        <button
          class="text-white bg-blue-500 rounded px-4 py-2"
          @click="showForm"
        >
          Add Movie
        </button>
      </div>
    </div>
    <div class="flex items-center justify-center space-x-4">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="w-96 h-auto bg-white rounded-md flex flex-col items-center justify-center overflow-hidden shadow-2xl group"
      >
        <div class="w-full h-[520px] overflow-hidden relative">
          <img
            :src="movie.image"
            :alt="`${movie.name} poster`"
            class="object-cover object-center h-[600px]"
          />
          <div class="absolute right-0 top-0 size-16">
            <StarIcon
              class="size-16"
              :class="movie.rating ? 'text-yellow-500' : 'text-gray-500'"
            />
            <span
              v-if="movie.rating"
              class="absolute inset-0 flex items-center justify-center text-xl text-yellow-800"
            >
              {{ movie.rating }}
            </span>
            <span
              v-else
              class="absolute inset-0 flex items-center justify-center text-xl text-gray-400"
            >
              -
            </span>
          </div>
        </div>
        <div class="w-full h-56 p-4 flex flex-col items-start justify-start">
          <div class="w-full h-16 shrink-0">
            <h3 class="text-2xl">{{ movie.name }}</h3>
            <div class="flex items-center justify-start space-x-1">
              <span
                v-for="genre in movie.genres"
                :key="`${movie.id}-genre-${genre}`"
                class="text-xs bg-indigo-500 text-white py-0.5 px-2 rounded-full"
                >{{ genre }}</span
              >
            </div>
          </div>
          <div class="h-24 flex-1">
            <p class="text-sm">{{ movie.description }}</p>
          </div>
          <div class="w-full h-10 shrink-0 flex justify-between">
            <div class="flex items-center justify-start">
              <span class="text-xs mr-2 leading-7">
                Rating: ({{ movie.rating ?? "-" }}/5)
              </span>
              <button
                v-for="star in 5"
                :key="`${movie.id}-star-${star}`"
                class="size-5 cursor-pointer disabled:cursor-not-allowed"
                :disabled="star === movie.rating"
                @click="setMovieRating(movie, star)"
              >
                <StarIcon
                  :class="[
                    star <= movie.rating ? 'text-yellow-500' : 'text-gray-500',
                  ]"
                />
              </button>
            </div>
            <div
              class="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2"
            >
              <button class="float-button hover:bg-indigo-500">
                <PencilIcon class="size-4" />
              </button>
              <button class="float-button hover:bg-red-500">
                <TrashIcon class="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.form-element {
  @apply flex flex-col items-start justify-start w-full;
}

.form-input {
  @apply w-full rounded-md bg-gray-900  border border-white/50 focus:border-blue-600 focus:outline-none px-2 py-1;
}

.float-button {
  @apply rounded-full bg-gray-300 size-10 flex items-center justify-center hover:text-white;
}
</style>
