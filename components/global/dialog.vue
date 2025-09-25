<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { useDialog } from "~/composables/useDialog";

const _controller = useDialog();
const modalDialog = ref(null);

onClickOutside(modalDialog, () => _controller.callback.onTapBack);
</script>

<template>
  <div v-show="_controller.isShown" class="overlay"></div>

  <Transition name="drop">
    <div v-show="_controller.isShown" class="modal-wrapper">
      <div ref="modalDialog" class="modal-card">
        <!-- <img
          src="/images/icons/icon-modal-warning.svg"
          class="modal-general-icon"
          :alt="_controller.content"
        />

        <div class="mt-4 text-center">
          <p class="modal-general-title">{{ _controller.title }}</p>
          <p class="modal-general-text" v-html="_controller.content"></p>
        </div>

        <div class="mt-10 lg:mt-14">
          <div class="grid grid-cols-2 gap-2 lg:gap-4">
            <button
              type="button"
              class="modal-action-button cancel"
              @click="_controller.callback.onTapBack"
            >
              {{ _controller.backText }}
            </button>
            <button
              type="button"
              class="modal-action-button enter"
              @click="_controller.callback.onTapConfirm"
            >
              {{ _controller.confirmText }}
            </button>
          </div>
        </div> -->
      </div>
    </div>
  </Transition>
</template>
