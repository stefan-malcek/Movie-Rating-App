<script setup>
import { items } from "./movies.json";
import { computed, reactive, ref } from "vue";
import { StarIcon, PencilIcon, TrashIcon } from "@heroicons/vue/24/solid";
import { cloneDeep } from "../utils/clone.js";
import { normalizeRating } from "../utils/number.js";

const movies = ref(cloneDeep(items));

const averageRating = computed(() => {
  const filledRatings = movies.value.filter((m) => m.rating);
  if (filledRatings.length === 0) {
    return "-";
  }

  const average = filledRatings.reduce((acc, m) => acc + m.rating, 0);
  return Number(average / filledRatings.length).toFixed(1);
});

const totalMovies = computed(() => movies.value.length);

const updateRating = (movieIndex, rating) => {
  movies.value[movieIndex].rating = normalizeRating(rating);
};

const resetRatings = () => {
  movies.value.forEach((movie) => {
    movie.rating = null;
  });
};

const showMovieForm = ref(false);

const showForm = () => {
  showMovieForm.value = true;
};

const availableGenres = reactive(["Action", "Comedy", "Drama", "Sci-Fi"]);
const form = reactive({
  id: null,
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

const removeMovie = (movieIndex) => {
  movies.value = movies.value.filter((_, index) => index !== movieIndex);
};

const editMovie = (movieIndex) => {
  const movie = movies.value[movieIndex];

  form.id = movie.id;
  form.name = movie.name;
  form.description = movie.description;
  form.image = movie.image;
  form.genres = movie.genres;
  form.inTheaters = movie.inTheaters;

  showForm();
};

const hideForm = () => {
  showMovieForm.value = false;
  resetForm();
};

const saveMovie = () => {
  if (!validate(form)) {
    return;
  }

  if (form.id) {
    updateMovie();
  } else {
    addMovie();
  }

  hideForm();
};

const addMovie = () => {
  if (!validate(form)) {
    return;
  }

  const movie = {
    id: Number(Date.now()),
    name: form.name,
    description: form.description,
    image: form.image,
    genres: form.genres,
    inTheaters: form.inTheaters,
  };
  movies.value.push(movie);
};

const updateMovie = () => {
  if (!validate(form)) {
    return;
  }

  const movie = movies.value.find((m) => m.id === form.id);
  if (!movie) {
    return;
  }

  movie.name = form.name;
  movie.description = form.description;
  movie.image = form.image;
  movie.genres = form.genres;
  movie.inTheaters = form.inTheaters;
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
  <div
    class="max-w-full h-screen flex flex-col items-center justify-center mx-auto"
  >
    <div
      v-if="showMovieForm"
      class="absolute inset-0 backdrop-blur bg-gray-800/40 z-10 flex items-center justify-center"
    >
      <form
        @submit.prevent="saveMovie"
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
            Save
          </button>
        </div>
      </form>
    </div>
    <div class="w-full flex items-center justify-between max-w-6xl p-4 mb-4">
      <div class="flex items-center justify-center gap-4 text-white">
        <span> Total Movies: {{ totalMovies }}</span>
        <span> / </span>
        <span> Average Rating: {{ averageRating }}</span>
      </div>
      <div class="flex items-center justify-center space-x-5">
        <button
          class="text-white bg-blue-500 rounded-md px-4 py-2"
          @click="resetRatings"
        >
          Reset Ratings
        </button>
        <button
          class="text-white bg-blue-500 rounded-md px-4 py-2"
          @click="showForm()"
        >
          Add Movie
        </button>
      </div>
    </div>
    <div class="flex items-center justify-center space-x-4">
      <div
        v-for="(movie, movieIndex) in movies"
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
                @click="updateRating(movieIndex, star)"
              >
                <StarIcon
                  :class="[
                    star <= movie.rating ? 'text-yellow-500' : 'text-gray-500',
                  ]"
                />
              </button>
            </div>
            <div class="hidden group-hover:flex space-x-2">
              <button
                class="float-button hover:bg-indigo-500"
                @click="editMovie(movieIndex)"
              >
                <PencilIcon class="size-4" />
              </button>
              <button
                class="float-button hover:bg-red-500"
                @click="removeMovie(movieIndex)"
              >
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
  @apply rounded-full bg-gray-200 p-3 hover:text-white;
}
</style>
