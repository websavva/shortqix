<template>
  <div>
    <form
      class="space-y-2"
      @submit.prevent="onSubmit"
      @reset.prevent="onReset"
    >
      <FormField
        v-slot="{ componentField }"
        name="url"
      >
        <fieldset
          class="flex items-center rounded-lg border border-2 border-input focus-within:ring-2 focus-within:ring-ring transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md h-13"
        >
          <FormItem class="flex-1">
            <FormControl>
              <Input
                type="text"
                v-bind="componentField"
                :disabled="
                  Boolean(
                    form.isSubmitting.value || shortenedUrl,
                  )
                "
                placeholder="Enter your long URL here"
                class="border-0 rounded-none focus-visible:ring-0 bg-transparent min-h-full"
              />
            </FormControl>
          </FormItem>

          <Slot
            class="rounded-none h-full border-0 w-13 shadow-none cursor-pointer text-xl"
          >
            <Button
              v-if="!shortenedUrl"
              :pending
              type="submit"
            >
              <template #icon>
                <ArrowRightIcon />
              </template>
            </Button>

            <Button
              v-else
              type="reset"
              variant="ghost"
            >
              <template #icon>
                <TrashIcon />
              </template>
            </Button>
          </Slot>
        </fieldset>

        <FormMessage />
      </FormField>

      <!-- Custom Code Input for Premium Users -->
      <SizeTransition
        singular
        concurrent
        :fade-config="{ duration: 150 }"
        :size-config="{ duration: 250 }"
      >
        <div v-if="isCodeVisible">
          <FormField
            v-slot="{ componentField }"
            name="code"
          >
            <FormItem class="space-y-2 pt-3">
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="Enter custom code"
                  class="rounded-lg border border-2 border-input focus-within:ring-2 focus-within:ring-ring transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md h-13"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </SizeTransition>

      <!-- Toggle Button for Custom Code -->
      <div
        v-if="isPremium"
        class="flex items-center justify-between"
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          class="text-muted-foreground hover:text-foreground"
          @click="onCodeToggle"
        >
          <template #icon>
            <PlusIcon
              v-if="!isCodeVisible"
              class="size-4"
            />

            <MinusIcon
              v-else
              class="size-4"
            />
          </template>

          Code
        </Button>

        <div
          v-if="isCodeVisible"
          class="text-xs text-muted-foreground"
        >
          Premium feature
        </div>
      </div>
    </form>

    <!-- Result Display -->
    <SizeTransition
      concurrent
      singular
    >
      <div v-if="shortenedUrl">
        <ShortenedLinkBox
          :url="shortenedUrl.shortUrl"
          :code="shortenedUrl.code"
          class="mt-6"
        />
      </div>
    </SizeTransition>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRightIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
} from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { Slot } from 'reka-ui';
import { useAuth, useToast } from '#imports';
import type { InternalApi } from 'nitropack/types';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Button,
  Input,
  SizeTransition,
  ShortenedLinkBox,
} from '#components';

import { CreateShortenedUrlDtoSchema } from '#shared/dtos';

const { isPremium } = useAuth();

const $toast = useToast();

const formSchema = toTypedSchema(
  CreateShortenedUrlDtoSchema,
);

const form = useForm({
  name: 'shorten-link-form',
  validationSchema: formSchema,
  initialValues: {
    url: '',
    code: null,
  },
});

const pending = ref(false);
const shortenedUrl = ref<
  InternalApi['/api/shorten']['post'] | null
>(null);
const isCodeVisible = ref(false);

const onSubmit = form.handleSubmit(
  async ({ url, code }) => {
    try {
      pending.value = true;

      const response = await $fetch('/api/shorten', {
        method: 'POST',
        body: {
          url,
          code: code || null,
        },

        credentials: 'include',
      });

      shortenedUrl.value = response;
    } catch (error: any) {
      $toast.toast({
        title: 'Failed to shorten link',
        description:
          error?.data?.message ||
          'Please try again with a valid URL.',
      });
    } finally {
      pending.value = false;
    }
  },
);

const onReset = () => {
  shortenedUrl.value = null;
  isCodeVisible.value = false;
  form.resetForm();
};

const onCodeToggle = () => {
  isCodeVisible.value = !isCodeVisible.value;
};
</script>
