<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { useSnackbar } from "~/composables/useSnackbar";

const _controller = useSnackbar();
const modalDialog = ref(null);

onClickOutside(modalDialog, () => _controller.tapExit());

// const snackbarIcon = computed(() => {
//   return _controller.isSuccess
//     ? "/images/icons/icon-snackbar-success.svg"
//     : "/images/icons/icon-snackbar-error.svg";
// });
</script>

<template>
  <div v-show="_controller.isShown" class="overlay"></div>

  <Transition name="drop">
    <div v-show="_controller.isShown" class="modal-wrapper">
      <div ref="modalDialog" class="modal-card">
        <!-- <img :src="snackbarIcon" class="modal-general-icon" :alt="_controller.message" />

        <div class="mt-4 text-center">
          <p class="modal-general-title">{{ _controller.title }}</p>
          <p class="modal-general-text" v-html="_controller.message"></p>
        </div>

        <div class="mt-10 lg:mt-14">
          <button
            type="button"
            class="modal-action-button enter"
            @click="_controller.tapExit()"
          >
            {{ _controller.buttonText }}
          </button>
        </div> -->
      </div>
    </div>
  </Transition>
</template>
